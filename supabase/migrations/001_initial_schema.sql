-- ============================================
-- ProPresenter Clone - Initial Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Organizations (multi-tenant: each church is an org)
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Profiles (users linked to auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'operator')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_org ON profiles(organization_id);

-- ============================================
-- Services (a Sunday service or event)
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'live', 'archived')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_org_date ON services(organization_id, date DESC);

-- ============================================
-- Service Sections (songs, scriptures, custom blocks)
-- ============================================
CREATE TABLE service_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('song', 'scripture', 'custom', 'media', 'announcement')),
  order_index INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sections_service ON service_sections(service_id, order_index);

-- ============================================
-- Slides (individual presentation slides)
-- ============================================
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES service_sections(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL DEFAULT '{"lines": []}',
  theme_id UUID,
  background_url TEXT,
  background_color TEXT DEFAULT '#000000',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_slides_section ON slides(section_id, order_index);

-- ============================================
-- Themes (reusable visual themes)
-- ============================================
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  font_family TEXT NOT NULL DEFAULT 'Inter',
  font_size INTEGER NOT NULL DEFAULT 48,
  font_color TEXT NOT NULL DEFAULT '#FFFFFF',
  font_weight TEXT NOT NULL DEFAULT '700',
  text_align TEXT NOT NULL DEFAULT 'center' CHECK (text_align IN ('left', 'center', 'right')),
  text_shadow BOOLEAN NOT NULL DEFAULT true,
  background_color TEXT,
  background_image_url TEXT,
  padding TEXT NOT NULL DEFAULT '40px',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_themes_org ON themes(organization_id);

-- Add foreign key for slides -> themes (after themes table exists)
ALTER TABLE slides ADD CONSTRAINT fk_slides_theme FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE SET NULL;

-- ============================================
-- Live Sessions (track what's currently showing)
-- ============================================
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  current_slide_id UUID REFERENCES slides(id) ON DELETE SET NULL,
  is_live BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_by UUID NOT NULL REFERENCES profiles(id)
);

CREATE INDEX idx_live_sessions_service ON live_sessions(service_id);
CREATE INDEX idx_live_sessions_active ON live_sessions(is_live) WHERE is_live = true;

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Organizations: members can read their own org
CREATE POLICY "org_members_read" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid())
  );

-- Profiles: users can read profiles in their org
CREATE POLICY "profiles_read_own_org" ON profiles
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM profiles p WHERE p.id = auth.uid())
  );

-- Services: org members can CRUD
CREATE POLICY "services_org_access" ON services
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid())
  );

-- Sections: inherit from services
CREATE POLICY "sections_via_service" ON service_sections
  FOR ALL USING (
    service_id IN (
      SELECT id FROM services WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
      )
    )
  );

-- Slides: inherit from sections
CREATE POLICY "slides_via_section" ON slides
  FOR ALL USING (
    section_id IN (
      SELECT id FROM service_sections WHERE service_id IN (
        SELECT id FROM services WHERE organization_id IN (
          SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
        )
      )
    )
  );

-- Themes: org members can CRUD
CREATE POLICY "themes_org_access" ON themes
  FOR ALL USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid())
  );

-- Live sessions: org members via service
CREATE POLICY "live_sessions_via_service" ON live_sessions
  FOR ALL USING (
    service_id IN (
      SELECT id FROM services WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()
      )
    )
  );

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_slides_updated_at
  BEFORE UPDATE ON slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Enable Realtime for live_sessions and slides
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE live_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE slides;

'use client';

import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';

import Alert from '@mui/material/Alert';

import { useBoolean } from 'src/hooks/use-boolean';

import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';
import { Content, Main } from './main';
import { Section } from './section';

// ----------------------------------------------------------------------

export type AuthSplitLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  section?: {
    title?: string;
    imgUrl?: string;
    subtitle?: string;
  };
};

export function AuthSplitLayout({ sx, section, children }: AuthSplitLayoutProps) {
  const mobileNavOpen = useBoolean();

  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      headerSection={
        /** **************************************
         * Header
         *************************************** */
        <HeaderBase
          disableElevation
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
          }}
          slotProps={{ container: { maxWidth: false } }}
          sx={{ position: { [layoutQuery]: 'fixed' } }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
      cssVars={{
        '--layout-auth-content-width': '420px',
      }}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={section?.title}
          layoutQuery={layoutQuery}
          imgUrl={section?.imgUrl}
          subtitle={section?.subtitle}
        />
        <Content layoutQuery={layoutQuery}>{children}</Content>
      </Main>
    </LayoutSection>
  );
}

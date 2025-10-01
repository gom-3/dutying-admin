import * as React from 'react';
import {Link} from 'react-router-dom';
import Logo from '@/assets/logo.svg?react';
import {AuthSection} from '@/components/auth-section';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {ROUTES} from '@/consts';

type TSidebarItem = {
  title: string;
  url: string;
  isActive?: boolean;
  items?: TSidebarItem[];
};

const data: {navMain: TSidebarItem[]} = {
  navMain: [
    {
      title: ROUTES.HOME.TITLE,
      url: ROUTES.HOME.PATH,
    },
    {
      title: ROUTES.NOTICE.TITLE,
      url: ROUTES.NOTICE.PATH,
    },
    {
      title: ROUTES.NOTIFICATION.TITLE,
      url: ROUTES.NOTIFICATION.PATH,
    },
  ],
};

export const AppSidebar = React.memo(({...props}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="size-8 rounded-lg">
                  <Logo className="size-full object-cover" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Dutying Admin</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                          <Link to={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AuthSection />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

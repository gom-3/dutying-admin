import * as React from 'react';
import Logo from '@/assets/logo.svg?react';
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

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="size-8 rounded-lg">
                  <Logo className="size-full object-cover" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Dutying Admin</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
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
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
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
      <SidebarRail />
    </Sidebar>
  );
}

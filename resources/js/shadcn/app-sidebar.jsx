import React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/shadcn/ui/sidebar"
import { Calendar, ChevronRight, File, FileBarChart2, Hamburger, Home, Inbox, Search, Settings, Settings2, Users, Wallet2 } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
  ],
}

const iconMap = {
    Home: Home,
    File: File,
    Settings: Settings,
    Calendar: Calendar,
    Inbox: Inbox,
    Search: Search,
    Users: Users,
    Wallet: Wallet2,
    Food: Hamburger,
    File: FileBarChart2
}

export function AppSidebar() {
  const items = [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: 'Home',
      },
      {
        title: "Laporan",
        url: "/admin/reports",
        icon: 'File',
      },
      {
        title: "User",
        url: "/admin/users",
        icon: 'Users',
      },
      {
        title: "Meja",
        url: "/admin/tables",
        icon: 'Calendar',
      },
      {
        title: "Menu",
        url: "/admin/menus",
        icon: 'Food',
      },
      {
        title: "Transaction",
        url: "/admin/transactions",
        icon: 'Wallet',
      },
      // {
      //   title: "Transaksi",
      //   url: "#",
      //   icon: File,
      //   items: [
      //     {
      //         title: "Penawaran Harga",
      //         url: "/price-quotation",
      //     }
      //   ]
      // },
  ]
  const url = usePage()

  return (
    // (<Sidebar {...props}>
    //   <SidebarHeader>
    //     <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
    //     <SearchForm />
    //   </SidebarHeader>
    //   <SidebarContent>
    //     {/* We create a SidebarGroup for each parent. */}
    //     {data.navMain.map((item) => (
    //       <SidebarGroup key={item.title}>
    //         <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
    //         <SidebarGroupContent>
    //           <SidebarMenu>
    //             {item.items.map((item) => (
    //               <SidebarMenuItem key={item.title}>
    //                 <SidebarMenuButton asChild isActive={item.isActive}>
    //                   <a href={item.url}>{item.title}</a>
    //                 </SidebarMenuButton>
    //               </SidebarMenuItem>
    //             ))}
    //           </SidebarMenu>
    //         </SidebarGroupContent>
    //       </SidebarGroup>
    //     ))}
    //   </SidebarContent>
    //   <SidebarRail />
    // </Sidebar>)
      <Sidebar>
        <SidebarHeader className="flex items-center mt-3">
            <p className='font-bold text-2xl text-red-500'>Donburi Resto</p>
        </SidebarHeader>
        <SidebarContent className="scrollbar-thin mt-5">
            <SidebarMenu>
                {
                    items.map((item) => {
                        // Cek apakah icon ada di iconMap, jika tidak gunakan Home sebagai default
                        const IconComponent = iconMap[item.icon] || Home;

                        return item.items ? (
                            <Collapsible
                                key={item.title}
                                asChild
                                className='group/collapsible '
                                defaultOpen={url.url === item?.items.find((subItem) => subItem.url === url.url)?.url}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton 
                                            isActive={url.url === item?.items.find((subItem) => subItem.url === url.url)?.url} 
                                            tooltip={item.title}
                                        >
                                            <IconComponent />
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {
                                                item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton 
                                                            asChild
                                                            isActive={url.url === subItem.url}
                                                        >
                                                            <a href={subItem.url}>
                                                                <ChevronRight />
                                                                <span>{subItem.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))
                                            }
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton isActive={url.url === item.url} asChild>
                                    <a href={item.url}>
                                        <IconComponent />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })
                }
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex items-center">
            <p className='text-xs text-gray-500 sticky bottom-0'>Copyright &copy; Edward 2025</p>
        </SidebarFooter>
    </Sidebar>
  );
}

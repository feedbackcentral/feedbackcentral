/* eslint-disable @next/next/no-img-element */
import { User } from "@feedbackcentral/types";
import { Dialog, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { useQuery } from "react-query";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export type SidebarItem =
  | {
      type: "item";
      name: string;
      href: string;
      icon?: React.FC<React.ComponentProps<"svg">>;
    }
  | {
      type: "category";
      name: string;
      icon?: React.FC<React.ComponentProps<"svg">>;
      children: SidebarItem[];
    };

export const SidebarShell = ({
  children,
  sidebarItems,
}: React.PropsWithChildren<{
  sidebarItems: SidebarItem[];
}>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  // TODO switch to custom supabase hook
  const user = useUser();

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery(
    "me",
    async () => {
      const { data, error } = await supabaseClient
        .from<User>("users")
        .select("*")
        .eq("id", user.user!.id)
        .single();

      if (error) {
        throw error;
      }

      return data || undefined;
    },
    { enabled: user.user != null }
  );

  const SidebarItems: React.FC<{ items: SidebarItem[] }> = ({ items }) => {
    return (
      <div className="mt-2">
        {items.map((item, i) => {
          if (item.type == "item") {
            return (
              <a
                key={item.name + i}
                href={item.href}
                className={classNames(
                  item.href == router.pathname
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                )}
              >
                {item.icon && (
                  <item.icon
                    className={classNames(
                      item.href == router.pathname
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-4 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                )}
                {item.name}
              </a>
            );
          } else {
            return (
              <div key={item.name + i} className="mt-5">
                <p>{item.name}</p>
                <SidebarItems items={item.children} />
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                      alt="Workflow"
                    />
                  </div>
                  <nav className="mt-5 px-2">
                    <SidebarItems items={sidebarItems} />
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <a href="#" className="flex-shrink-0 group block">
                    <div className="flex items-center">
                      <div>
                        <img
                          className="inline-block h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                          Tom Cook
                        </p>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          View profile
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                  alt="Workflow"
                />
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                <SidebarItems items={sidebarItems} />
              </nav>
            </div>
            {user.user && (
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/profile" className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src={
                          userData && userData.profile_picture
                            ? userData.profile_picture
                            : `https://avatars.dicebear.com/api/identicon/${user.user.id}.svg`
                        }
                        alt="Your profile photo"
                      />
                    </div>
                    <div className="ml-3">
                      {/* TODO pre-fetch user data here! */}
                      {/* @ts-ignore */}
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {userIsLoading && !userData && (
                          <span className="w-36 animate-pulse bg-gray-300 h-6 rounded-md"></span>
                        )}
                        {userData && userData.username}
                        {userError && user.user.id.substring(0, 20)}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1 bg-gray-100">
            <div id="__content">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

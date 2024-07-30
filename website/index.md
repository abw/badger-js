---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Badger JS"
  tagline: A Javascript Project Toolkit
  image:
    src: images/badger3.svg
    alt: Badger
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Documentation
      link: /filesystem
features:
  - title: Filesystem Utilities
    details: Common file and directory operations made simple
    link: /filesystem
  - title: Data Codecs
    details: The easy way to encode and decode JSON or YAML from text or files
    link: /codecs
  - title: Configuration Files
    details: A central store for configuration files for your project
    link: /config-files
  - title: Library Modules
    details: Dynamically load JS library modules
    link: /library-modules
  - title: Data Paths
    details: Navigate data using simple URL-like paths
    link: /data-paths
  - title: Workspace
    details: A workspace ties your project together, providing easy access to resources
    link: /workspace
  - title: Components
    details: A component based architecture for independent but inter-dependent modules
    link: /components
  - title: User Input
    details: For processing command line arguments and getting user input
    link: /user-input
  - title: Project Setup
    details: User-friendly tools for configuring a project
    link: /setup
  - title: ANSI Colors
    details: Add a splash of color to your output
    link: /colors
  - title: Debugging
    details: Functions to make debugging your code a little easier
    link: /debugging
  - title: Quitting
    details: You want out?  Functions for cleanly exiting a script.
    link: /quitting
  - title: Progress
    details: Progress bars and spinners are so one-dimensional!
    link: /progress
  - title: Watch
    details: A simple way to watch files for change
    link: /watch

---
## Who Ordered This?

This is an application toolkit for Javascript projects. It provides a number
of classes and utility functions to make life easier when creating and
managing a server-side Node.js Javascript project.

It is loosely based around the [Badger toolkit for Perl](https://github.com/abw/badger)
and was written primarily to help migrate some old Perl projects to Javascript.

## Opinionated and Selfish Software

::: warning WARNING - People Who Share Their Source Code Do Not Owe You Anything!
This is OSS: **Open Source Software** that you can freely download, use and adapt
if you want to. But here OSS also stands for **Opinionated and Selfish Software**.

It doesn't set out to please all the people, all the time. On the contrary,
it is designed to please one person (me) most of the time. I wrote it to help
me get my job done.  If it helps you get your job done then great.  But please
don't complain if it doesn't do what you want.  It's not my job to help you
do your job.

https://freeasinweekend.org/open-source-open-mind
:::

<center>
<img src="/images/oss.svg" width="150" height="150" style="margin-top: 4rem">
</center>

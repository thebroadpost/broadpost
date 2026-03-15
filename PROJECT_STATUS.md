# Broadpost Project Status

## Overview

Broadpost is a live blog/news platform with separate reader and admin experiences, powered by React, TypeScript, Vite, Tailwind CSS, React Query, and Supabase.

This document lists the features that are implemented, connected, and currently working based on the present codebase.

## Completed And Working Features

### 1. Public Website

- Homepage with hero section, category tabs, editor picks, opinion section, and sidebar widgets.
- Category pages that filter posts by category slug.
- Individual blog post pages with:
  - cover image
  - excerpt
  - author block
  - read time
  - related posts
  - comments section
  - share actions
  - bookmark action
- Search modal for published posts.
- Footer and top navigation.

### 2. Reader Account Features

- Google sign-in for reader accounts.
- Account sidebar and account area pages.
- Profile page.
- Reading list / bookmarks.
- Notifications page.
- Newsletter subscription page.
- Settings page with theme mode controls.

### 3. Admin Authentication And Access Control

- Dedicated admin login route.
- Google login option on admin login page.
- Supabase-backed admin role system using `user_roles`.
- Admin route guard using role check, not just frontend email checks.
- Admin-only access flow for dashboard, posts, and comments.

### 4. Admin Dashboard

- Redesigned admin dashboard UI.
- Real metrics instead of mock/fake stats.
- Cards for:
  - total posts
  - published posts
  - drafts
  - comments
  - views
- Real 7-day views chart.
- Recent posts table.
- Top categories panel.
- Recent comments panel.
- Publishing health widget.

### 5. Admin Post Management

- Post listing page.
- New post creation page.
- Post editing flow.
- Draft and publish actions.
- Markdown editor integration.
- Slug generation.
- Cover image URL input.
- Tags input.
- Author fields in admin form:
  - author name
  - author bio
  - author avatar
- Inline category creation directly from post form.

### 6. Admin Comment Moderation

- Admin comments page.
- View all comments.
- Filter pending and approved comments.
- Approve / unapprove comments.
- Delete comments.

### 7. Categories System

- Category records stored in Supabase.
- Category creation from admin post form.
- Category links on public site.
- Category-based post filtering on public pages.
- Category post counts supported by SQL sync setup.

### 8. Post Visibility Flow

- Admin can create and publish a post.
- Published posts are used by public website queries.
- Public homepage and category pages now read from real Supabase post data.
- Post page fetches by slug.

### 9. Real Analytics Wiring

- `post_views` SQL setup added.
- `record_post_view` RPC added.
- View events connected to post detail page view tracking.
- Dashboard insights use real Supabase data.

### 10. Newsletter System

- Newsletter subscription table setup SQL.
- Public newsletter signup from sidebar.
- Reader newsletter subscription toggle in account area.
- Duplicate email handling included.

## Database / SQL Files Added

### `setup_admin_roles.sql`

Sets up:

- `user_roles` table
- `is_admin()` function
- admin role assignment for configured user
- admin policies for posts, comments, and categories

### `setup_newsletters.sql`

Sets up:

- `subscriptions` table
- newsletter insert policy

### `setup_realtime_blog.sql`

Sets up:

- `post_views` table
- `record_post_view` RPC
- category post count refresh function
- trigger to keep category counts in sync

## Current Schema Alignment

The app is now aligned to the active Supabase schema shown in the project:

- `posts.category` is used as text category source
- `posts.author_name`, `posts.author_bio`, `posts.author_avatar` are used for author display
- public UI normalizes post data into the shape components expect

## Working User Flows

### Reader Flow

1. Reader signs in with Google.
2. Reader browses homepage and categories.
3. Reader opens a post.
4. View count increases.
5. Reader can comment, bookmark, search, and subscribe to newsletter.

### Admin Flow

1. Admin signs in through `/admin/login`.
2. Role is checked in Supabase.
3. Admin enters dashboard.
4. Admin creates category if needed.
5. Admin writes post, adds author details, image, tags, and category.
6. Admin publishes post.
7. Post appears on public website if status is `published`.

## UI Improvements Already Done

- Admin dashboard redesign.
- Dark mode support added across main areas.
- Improved user sidebar navigation.
- Better account section structure.
- More polished blog cards and dashboard presentation.

## Known Remaining Gaps / Next Improvements

These are not blockers for the current working system, but are good next steps:

- Full schema cleanup to remove fallback handling for older column assumptions.
- Category management page in admin.
- Image upload via Supabase Storage instead of URL-only input.
- Richer analytics panels and date-range filters.
- Real notification generation logic.
- Email sending pipeline for newsletters.
- Tests and lint cleanup across older files.
- Better RLS review across all tables.

## Recommended Next Phase

### Priority 1

- Add admin category management page.
- Add image uploader for post cover images.
- Add publish confirmation and better form validation messages.

### Priority 2

- Add post preview mode.
- Add author management.
- Improve dashboard charts and trend comparisons.

### Priority 3

- Add newsletter sending workflow.
- Add notification generation and in-app triggers.
- Add automated testing and cleanup pass.

## Delivery Note

The project is now in a much more usable state:

- admin auth is controlled through Supabase roles
- dashboard uses real data
- posts can be created with real author/category content
- published posts can flow to the public site
- analytics hooks and SQL setup are in place for real insight tracking

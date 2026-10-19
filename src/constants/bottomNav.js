// Tab data and the 11 bottom navigation styles from the reference sheet.
//
// `icon` is an Ionicons base name: the filled glyph is `icon`, the outline
// glyph is `${icon}-outline`. Tabs with `action: true` fire `onAction`
// instead of becoming the selected tab (the "Create" buttons).

export const PRIMARY = '#5B4CF0';
export const INK = '#15151F';
export const MUTED = '#8A8FA3';

const tab = (key, label, icon, extra) => ({ key, label, icon, ...extra });

const HOME = tab('home', 'Home', 'home');
const EXPLORE = tab('explore', 'Explore', 'compass');
const SEARCH = tab('search', 'Search', 'search');
const PROJECTS = tab('projects', 'Projects', 'folder-open');
const SAVED = tab('saved', 'Saved', 'bookmark');
const PROFILE = tab('profile', 'Profile', 'person');
const INBOX = tab('inbox', 'Inbox', 'notifications');
const ACTIVITY = tab('activity', 'Activity', 'notifications');
const MESSAGE = tab('message', 'Message', 'chatbubble');
const ANALYTICS = tab('analytics', 'Analytics', 'analytics');
const WORK = tab('work', 'Work', 'briefcase');
const BROWSE = tab('browse', 'Browse', 'browsers');
const LIBRARY = tab('library', 'Library', 'library');
const CREATE = tab('create', 'Create', 'add', { action: true });
const CREATE_ICON_ONLY = tab('create', 'Create', 'add', { action: true, hideLabel: true });

const LIGHT_BAR = {
  background: '#FFFFFF',
  active: PRIMARY,
  inactive: MUTED,
  indicator: PRIMARY,
};

/**
 * layout:     'docked' sits on the bottom edge, 'floating' is inset with rounded corners.
 * surface:    'plain' | 'glass' | 'gradient' | 'neumorph'
 * indicator:  'none' | 'dot' | 'pill' | 'underline' | 'topLine' (slides between tabs)
 * iconStyle:  'filled' swaps to the filled glyph when active, 'outline' keeps outlines.
 * center:     how an `action` tab is drawn: 'inline' circle or 'raised' FAB.
 * backdrop:   screen colour(s) behind the bar in the demo.
 */
export const NAV_VARIANTS = [
  {
    id: 'minimal',
    number: '01',
    title: 'Minimal Clean',
    tagline: 'Simple • Clean • Focused',
    tabs: [HOME, EXPLORE, PROJECTS, SAVED, PROFILE],
    layout: 'docked',
    surface: 'plain',
    indicator: 'dot',
    iconStyle: 'filled',
    colors: LIGHT_BAR,
    backdrop: ['#F4F5F9'],
  },
  {
    id: 'glass',
    number: '02',
    title: 'Glassmorphism',
    tagline: 'Modern • Blurred • Aesthetic',
    tabs: [HOME, EXPLORE, PROJECTS, tab('alerts', 'Saved', 'notifications'), PROFILE],
    layout: 'floating',
    surface: 'glass',
    indicator: 'dot',
    iconStyle: 'filled',
    colors: {
      background: 'rgba(255,255,255,0.16)',
      border: 'rgba(255,255,255,0.45)',
      active: '#FFFFFF',
      inactive: 'rgba(255,255,255,0.72)',
      indicator: '#FFFFFF',
    },
    backdrop: ['#6D5BF6', '#9C7BF2', '#F08BA8'],
  },
  {
    id: 'floating',
    number: '03',
    title: 'Floating (Detached)',
    tagline: 'Floating • Premium • Elevated',
    tabs: [HOME, SEARCH, CREATE, INBOX, PROFILE],
    layout: 'floating',
    surface: 'plain',
    indicator: 'none',
    iconStyle: 'filled',
    center: 'inline',
    bump: true,
    colors: { ...LIGHT_BAR, centerBackground: PRIMARY, centerIcon: '#FFFFFF' },
    backdrop: ['#1C1C22'],
  },
  {
    id: 'neumorph',
    number: '04',
    title: 'Neumorphism',
    tagline: 'Soft • Subtle • Smooth',
    tabs: [HOME, SEARCH, ANALYTICS, MESSAGE, PROFILE],
    layout: 'floating',
    surface: 'neumorph',
    indicator: 'none',
    iconStyle: 'filled',
    colors: {
      background: '#EEF0F5',
      shadowDark: '#A3ACC2',
      shadowLight: '#FFFFFF',
      active: PRIMARY,
      inactive: '#6E7389',
      indicator: PRIMARY,
    },
    backdrop: ['#EEF0F5'],
  },
  {
    id: 'pill',
    number: '05',
    title: 'Pill Highlight',
    tagline: 'Clear • Friendly • Usable',
    tabs: [HOME, EXPLORE, PROJECTS, SAVED, PROFILE],
    layout: 'docked',
    surface: 'plain',
    indicator: 'pill',
    iconStyle: 'filled',
    colors: { ...LIGHT_BAR, indicator: '#ECE9FF' },
    backdrop: ['#F4F5F9'],
  },
  {
    id: 'fab',
    number: '06',
    title: 'Center FAB',
    tagline: 'Action Focused • Bold • Creative',
    tabs: [HOME, EXPLORE, CREATE_ICON_ONLY, INBOX, PROFILE],
    layout: 'docked',
    surface: 'plain',
    indicator: 'none',
    iconStyle: 'filled',
    center: 'raised',
    colors: {
      ...LIGHT_BAR,
      active: INK,
      centerBackground: PRIMARY,
      centerIcon: '#FFFFFF',
    },
    backdrop: ['#EDEEF3'],
  },
  {
    id: 'gradient',
    number: '07',
    title: 'Gradient Bold',
    tagline: 'Vibrant • Modern • Eye-catching',
    tabs: [HOME, SEARCH, CREATE, ACTIVITY, PROFILE],
    layout: 'docked',
    surface: 'gradient',
    indicator: 'none',
    iconStyle: 'filled',
    center: 'inline',
    colors: {
      gradient: ['#5B4CF0', '#A04DE8', '#F06CB8'],
      active: '#FFFFFF',
      inactive: 'rgba(255,255,255,0.7)',
      indicator: '#FFFFFF',
      centerBackground: '#FFFFFF',
      centerIcon: PRIMARY,
    },
    backdrop: ['#F4F5F9'],
  },
  {
    id: 'outline',
    number: '08',
    title: 'Outline Icons',
    tagline: 'Light • Minimal • Elegant',
    tabs: [HOME, EXPLORE, WORK, MESSAGE, PROFILE],
    layout: 'docked',
    surface: 'plain',
    indicator: 'underline',
    iconStyle: 'outline',
    colors: LIGHT_BAR,
    backdrop: ['#F4F5F9'],
  },
  {
    id: 'topLine',
    number: '09',
    title: 'Tab with Indicator',
    tagline: 'Indicator • Simple • Intuitive',
    tabs: [HOME, SEARCH, PROJECTS, INBOX, PROFILE],
    layout: 'docked',
    surface: 'plain',
    indicator: 'topLine',
    iconStyle: 'filled',
    colors: LIGHT_BAR,
    backdrop: ['#F4F5F9'],
  },
  {
    id: 'curved',
    number: '10',
    title: 'Curved Background',
    tagline: 'Soft Curve • Different • Stylish',
    tabs: [HOME, EXPLORE, tab('create', 'Create', 'add-circle'), SAVED, PROFILE],
    layout: 'floating',
    surface: 'gradient',
    indicator: 'underline',
    iconStyle: 'filled',
    colors: {
      gradient: ['#6A5BF5', '#8B6CF7', '#A77DF8'],
      active: '#FFFFFF',
      inactive: 'rgba(255,255,255,0.72)',
      indicator: '#FFFFFF',
    },
    backdrop: ['#F4F5F9'],
  },
  {
    id: 'dock',
    number: '11',
    title: 'Dock Style (iOS Inspired)',
    tagline: 'iOS Look • Floating Dock • Smooth',
    tabs: [HOME, BROWSE, LIBRARY, SEARCH, PROFILE],
    layout: 'floating',
    surface: 'glass',
    indicator: 'none',
    iconStyle: 'filled',
    colors: {
      background: 'rgba(242,243,248,0.78)',
      border: 'rgba(255,255,255,0.9)',
      active: PRIMARY,
      inactive: '#5A5E70',
      indicator: PRIMARY,
    },
    backdrop: ['#DCDDEA', '#EEEFF6'],
  },
];

export const DESIGN_TIPS = [
  'Keep 4–5 items only',
  'Active state should be clear',
  'Use consistent icon style',
  'Min. tap area 48×48px',
  'Add micro interactions',
];

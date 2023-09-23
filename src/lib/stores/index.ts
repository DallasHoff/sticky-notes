import { derived } from 'svelte/store';
import { NotesStore } from './notes';
import { ThemeStore, type Theme } from './theme';
import { TagsStore } from './tags';
import { SettingsStore } from './settings';

export const tags = new TagsStore();
export const notes = new NotesStore(tags);

export const settings = new SettingsStore();

export const theme = new ThemeStore();
export const themeUpperCase = derived(theme, ($theme) => $theme.toUpperCase() as Uppercase<Theme>);

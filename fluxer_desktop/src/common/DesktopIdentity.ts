// SPDX-License-Identifier: AGPL-3.0-or-later

import {BUILD_CHANNEL} from '@electron/common/BuildChannel';

interface SelfHostedIdentity {
	appName: string;
	bundleId: string;
	linuxDesktopEntryId: string;
	storageDirectoryName: string;
	windowsVelopackId: string;
	windowsAppUserModelId: string;
	windowsToastActivatorClsid: string;
	macosTrayPositionGuid: string;
}

// Self-hosted build identity; set to null to restore the upstream Fluxer identity.
// Keep in sync with selfHostedIdentity in electron-builder.config.cjs.
const SELF_HOSTED_IDENTITY: SelfHostedIdentity | null = {
	appName: 'Chat trelicas',
	bundleId: 'br.net.trelicas.chat',
	linuxDesktopEntryId: 'chat-trelicas',
	storageDirectoryName: 'chattrelicas',
	windowsVelopackId: 'chat_trelicas_desktop',
	windowsAppUserModelId: 'Trelicas.ChatTrelicas',
	windowsToastActivatorClsid: '{44984614-D1FD-4AFC-A671-5B3680F456BD}',
	macosTrayPositionGuid: '917ca7ab-d921-40e4-bba4-57a8e3afbc79',
};

export const DESKTOP_APP_NAME =
	SELF_HOSTED_IDENTITY?.appName ?? (BUILD_CHANNEL === 'canary' ? 'Fluxer Canary' : 'Fluxer');
export const MACOS_BUNDLE_ID =
	SELF_HOSTED_IDENTITY?.bundleId ?? (BUILD_CHANNEL === 'canary' ? 'app.fluxer.canary' : 'app.fluxer');
export const LINUX_DESKTOP_ENTRY_ID =
	SELF_HOSTED_IDENTITY?.linuxDesktopEntryId ?? (BUILD_CHANNEL === 'canary' ? 'fluxer-canary' : 'fluxer');
export const DESKTOP_STORAGE_DIRECTORY_NAME: string | null = SELF_HOSTED_IDENTITY?.storageDirectoryName ?? null;
export const WINDOWS_SHORTCUT_AUTHOR = 'Fluxer Platform AB';
export const WINDOWS_VELOPACK_ID =
	SELF_HOSTED_IDENTITY?.windowsVelopackId ?? (BUILD_CHANNEL === 'canary' ? 'fluxer_desktop_canary' : 'fluxer_desktop');
export const WINDOWS_LEGACY_SQUIRREL_ID = 'fluxer_app';
export const WINDOWS_APP_USER_MODEL_ID =
	SELF_HOSTED_IDENTITY?.windowsAppUserModelId ??
	(BUILD_CHANNEL === 'canary' ? 'Fluxer.Fluxer.Canary' : 'Fluxer.Fluxer');
export const WINDOWS_LEGACY_APP_USER_MODEL_IDS = [`velopack.${WINDOWS_VELOPACK_ID}`];
export const WINDOWS_TOAST_ACTIVATOR_CLSID =
	SELF_HOSTED_IDENTITY?.windowsToastActivatorClsid ??
	(BUILD_CHANNEL === 'canary' ? '{9CEDB5C0-3552-43B0-A279-2232E0CDF74C}' : '{48EEF21B-F3AE-431E-8CF2-386FFB2143F2}');
export const MACOS_TRAY_POSITION_GUID =
	SELF_HOSTED_IDENTITY?.macosTrayPositionGuid ??
	(BUILD_CHANNEL === 'canary' ? '1a39981b-b4cc-46a4-8f7e-9fce187110f5' : '11c70c9f-a35d-4328-9040-f722dc5fa0a0');

# Resolve Android APK "Download Blocked / Cannot Download Securely" Issue

Deliver a bulletproof Android APK download and installation pipeline that resolves Android Chrome and Google Files security blocks ("Download blocked or file cannot be downloaded securely").

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your responses:
> 1. **Device Error**: "Download blocked or file cannot be downloaded securely".
> 2. **Environment**: Using Google Files / Android Chrome.
> 3. **Installation Preference**: Focus strictly on fixing the direct native Android APK package (no PWA diversion).

- **Confirmed Decision 1**: Implement multi-transport download mechanisms (Direct HTTPS with strict MIME headers, streaming server-side fallback, and unblocked ZIP archive package) to bypass Android carrier and browser APK security filters.
- **Confirmed Decision 2**: Remove problematic `target="_blank"` and blob-URL navigation on mobile links, which modern Android Chrome flags as insecure download attempts.
- **Confirmed Decision 3**: Provide a dedicated Google Files & Chrome step-by-step resolution guide directly in the download modal.

## 1. Overview & Core Concept

- **What It Does**: Resolves all network, browser, and OS-level blocks that prevent Android devices from saving and installing `Audio-v4.3.1-universal.apk`.
- **Target Audience / Persona**: Android users downloading the Audio app on modern Android (Android 11 through 15) using Google Chrome and managing files via Google Files.
- **Key Value**: Guarantees users can successfully download and install the official signed APK without encountering silent download aborts, insecure content blocks, or sandboxed iframe restrictions.

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. User taps "Install APK" in the Audio header or player.
  2. The updated **Install on Android** modal opens with a prominent primary download button, a **Secure Mirror** button, and an **Unblocked ZIP Archive** button.
  3. Clicking any download option triggers an instant, authenticated file download with correct `Content-Disposition`, `X-Content-Type-Options: nosniff`, and `application/vnd.android.package-archive` headers.
  4. A clear 3-step visual instruction card for **Google Files** guides the user through:
     - Tapping "Download anyway" if Chrome warns about unknown APK sources.
     - Opening Google Files $\rightarrow$ Downloads or App Install Files (.apk).
     - Toggling "Allow from this source" when Android security prompts.

```
┌────────────────────────────────────────────────────────────────────────┐
│  AUDIO · ANDROID INSTALLATION CENTER                                  │
├────────────────────────────────────────────────────────────────────────┤
│  Audio-v4.3.1-universal.apk · 25.0 MB · Signed Native Package         │
│                                                                        │
│  [ Primary Download (Direct APK) ]      [ Secure Server Mirror ]      │
│                                                                        │
│  [ Bypasses Carrier/File Blocks: Download APK as .zip (Instant) ]      │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ GOOGLE FILES & CHROME TROUBLESHOOTING GUIDE                      │  │
│  │ 1. Chrome: If "Can't download securely" appears, tap Details ->  │  │
│  │    "Download anyway".                                            │  │
│  │ 2. Google Files: Open Google Files -> Browse -> "Apps" ->        │  │
│  │    "App install files (.apk)" -> tap Audio-v4.3.1.apk.           │  │
│  │ 3. Unknown Sources: In Settings, toggle "Allow from this source".│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Triple-Path Download Architecture (Direct + Mirror API + ZIP Archive)**
  - *Chosen Approach*: Provide 3 redundant download paths:
    1. Direct static link with `target="_self"` (avoids Chrome popup blocker).
    2. Server-side streaming endpoint (`/api/download/apk`) with `nosniff`, `Content-Length`, `Content-Disposition: attachment`, and CORS headers.
    3. Packaged ZIP archive (`Audio-v4.3.1-universal.zip`) containing the APK, which completely bypasses automated Android carrier/Google Safe Browsing heuristics that block `.apk` extensions.
  - *Why*: Different Android vendors (Pixel with Google Files, Samsung OneUI with Knox, Xiaomi MIUI, Motorola) enforce varying restrictions on raw `.apk` HTTP downloads. Providing an unblocked ZIP ensures 100% success rate.

- **Decision 2: Elimination of Insecure Download Triggers**
  - *Chosen Approach*: Replace `target="_blank"` and client-side `blob:` synthesis with direct navigation and explicit HTTPS downloads.
  - *Why*: In Chrome on Android 12+, an `<a href="..." target="_blank" download>` link inside an iframe or web view is flagged as an untrusted background navigation, throwing "Download blocked or file cannot be downloaded securely". Using standard `target="_self"` or explicit window navigation resolves this security trigger.

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────┐          ┌──────────────────────────────┐
│     Android Device      │          │        Audio Server          │
│ (Chrome / Google Files) │          │     (Vite Middleware)        │
└────────────┬────────────┘          └──────────────┬───────────────┘
             │                                      │
             │ 1. GET /downloads/Audio-v4.3.1.apk   │
             ├─────────────────────────────────────►│
             │                                      │ 2. Checks file existence & stat
             │                                      │    Sets Content-Type & nosniff
             │ 3. 200 OK (Stream with headers)      │
             │◄─────────────────────────────────────┤
             │                                      │
             │ [If blocked by Google Files/Carrier] │
             │ 4. GET /api/download/apk?format=zip  │
             ├─────────────────────────────────────►│
             │ 5. Returns Audio-v4.3.1-universal.zip│
             │◄─────────────────────────────────────┤
             │                                      │
             ▼                                      ▼
    Installed via Google Files           Zero Permission Error
```

- **Endpoints & Static Assets**:
  - `/downloads/Audio-v4.3.1-universal.apk` (Direct native APK)
  - `/downloads/Audio-v4.3.1-universal.apk.zip` (Pre-packaged unblocked ZIP)
  - `/api/download/apk` (Dedicated download proxy with multi-format streaming)
- **Security Headers Injected**:
  - `Content-Type: application/vnd.android.package-archive`
  - `Content-Disposition: attachment; filename="Audio-v4.3.1-universal.apk"`
  - `X-Content-Type-Options: nosniff`
  - `Access-Control-Allow-Origin: *`
  - `Accept-Ranges: bytes`

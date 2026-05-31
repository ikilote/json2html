// test-setup.ts
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {});

// Polyfill for checkVisibility (needed for Angular 20+)
if (typeof Element !== 'undefined' && !Element.prototype.checkVisibility) {
    Element.prototype.checkVisibility = function () {
        // @ts-ignore
        return !!(this.offsetWidth || this.offsetHeight || this.getClientRects().length);
    };
}

// Create root elements for Angular component tests (only needed for src/app/ tests)
// Most tests in this project (json2html library) are pure logic tests without DOM
if (typeof document !== 'undefined') {
    for (let i = 0; i < 10; i++) {
        if (!document.getElementById(`root${i}`)) {
            const el = document.createElement('div');
            el.id = `root${i}`;
            document.body.appendChild(el);
        }
    }
}

// Minimal global cleanup after each test
afterEach(async () => {
    // Restore all mocks and spies
    vi.restoreAllMocks();

    // Reset timers to prevent hanging tests
    vi.clearAllTimers();
    vi.useRealTimers();
});

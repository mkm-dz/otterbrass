let appInsights = require('applicationinsights');

export class AppInsights {
    private static appInsightsInstance: AppInsights;
    private client;

    private constructor() {
        /* Used for debugging purposes, we don't want to send debug information to appInsights. */
        if (!process.env.skipTelemetry) {
            appInsights.setup(process.env.AppInsightsInstrumentationKey).start();
        } else {
            appInsights = new MockAppInsights();
        }

        this.client = appInsights.defaultClient;
    }

    static get instance(): AppInsights {
        if (!AppInsights.appInsightsInstance) {
            AppInsights.appInsightsInstance = new AppInsights();
        }

        return AppInsights.appInsightsInstance
    }

    public logException(msg: string) {
        this.client.trackException({ exception: new Error(msg) });
    }

    public logTrace(msg: string) {
        this.client.trackTrace(msg);
    }
}

/**
 * Used for debugging purposes, we don't want to send debug information to appInsights.
 */
class MockAppInsights {
    public defaultClient;
    public constructor() {
        this.defaultClient = {
            trackException: (exception: any) => console.log(JSON.stringify(exception)),
            trackTrace: (exception: any) => console.log(JSON.stringify(exception)),
        }
    }
}

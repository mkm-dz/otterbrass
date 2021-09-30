let appInsights = require('applicationinsights');

export class AppInsights {
    private static appInsightsInstance: AppInsights;
    private client;

    private constructor() {
        appInsights.setup(process.env.AppInsightsInstrumentationKey).start();
        this.client = appInsights.defaultClient;
        /* Used for debugging purposes, we don't want to send debug information to appInsights. */
        if (process.env.skipTelemetry) {
            appInsights.defaultClient.config.disableAppInsights = true
        }
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
        this.client.trackTrace({message: msg});
    }
}
# **Monitoring and Observability**

## **Monitoring Stack**

* **Frontend:** Sentry (Crash Reporting, Performance).  
* **Backend:** Supabase Platform Logs \+ Sentry (Edge Function errors/perf).  
* **Error Tracking:** Sentry (Unified FE/BE).  
* **Performance:** Sentry Performance \+ Supabase Query Monitoring \+ Custom Bridge/Phaser instrumentation.  
* **Realtime:** Supabase Dashboard.

## **Key Metrics**

* **Frontend:** Crash Rate (\<0.1%), ANRs, Startup Time (\<3s), UI Perf (60fps), JS Errors, API Perf, Bridge Perf.  
* **Backend:** Edge Func Rate/Errors(\<0.5%)/Duration, DB Query Perf/Usage, API GW Metrics, Auth Metrics.  
* **Game Engine:** Combat FPS (60fps), Input Latency (\<50ms), Memory Usage (\<150MB), Asset Load Times, Game Logic Errors.

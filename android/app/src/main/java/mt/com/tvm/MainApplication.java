package mt.com.tvm;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airship.customwebview.CustomWebViewPackage;
import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.guichaguri.trackplayer.TrackPlayer;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.codepush.react.ReactInstanceHolder;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.realm.react.RealmReactPackage;
import com.reactnativecommunity.asyncstorage.*;

//import com.reactnativenavigation.NavigationReactPackage;

public class MainApplication extends NavigationApplication implements ShareApplication, ReactInstanceHolder{

     @Override
     public boolean isDebug() {
         // Make sure you are using BuildConfig from your own application
         return BuildConfig.DEBUG;
     }

     protected List<ReactPackage> getPackages() {
         // Add additional packages you require here
         // No need to add RnnPackage and MainReactPackage
         return Arrays.<ReactPackage>asList(
             new RealmReactPackage(),
             new RNFirebasePackage(),
             new RNFirebaseFunctionsPackage(),
             new RNFirebaseCrashlyticsPackage(),
             new RNFirebaseAnalyticsPackage(),
             new RNFirebaseMessagingPackage(),
             new RNFirebaseNotificationsPackage(),
             new ImagePickerPackage(),
             new RNDeviceInfo(),
             new LinearGradientPackage(),
             new SvgPackage(),
             new RNFirebaseDatabasePackage(),
             new TrackPlayer(),
             new RNFetchBlobPackage(),
             new OrientationPackage(),
             new RNSharePackage(),
             new CustomWebViewPackage(),
             new RNExitAppPackage(),
             new AsyncStoragePackage(),
             new CodePush("E20nyEhuYkX_M92zKeHeC5UslT2J5e49a34e-8dce-4a4f-9cec-50398aa47d61", getApplicationContext(), BuildConfig.DEBUG)
         );
     }

     @Override
     public List<ReactPackage> createAdditionalReactPackages() {
         return getPackages();
     }

     @Override
      public String getFileProviderAuthority() {
             return "com.tvm.provider";
      }

     @Override
        	public String getJSBundleFile() {
                // Override default getJSBundleFile method with the one CodePush is providing
        	return CodePush.getJSBundleFile();
      }

      @Override
            public ReactInstanceManager getReactInstanceManager() {
                // CodePush must be told how to find React Native instance
            return getReactNativeHost().getReactInstanceManager();
      }

     @Override
      public String getJSMainModuleName() {
          return "index";
      }

      @Override
      public void onCreate() {
        super.onCreate();
        Fabric.with(this, new Crashlytics());
        //Fabric.with(this);
//        Appsee.start(getString(R.string.));
        SoLoader.init(this, /* native exopackage */ false);
      }
 }

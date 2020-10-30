package mt.com.tvm;


import com.reactnativenavigation.controllers.SplashActivity;
import android.view.View;
 public class MainActivity extends SplashActivity {

   @Override
     public View createSplashLayout() {
       return new View(this);   // <====== TO AVOID WHITE BACKGROUND
     }
 }

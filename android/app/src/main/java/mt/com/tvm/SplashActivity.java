package mt.com.tvm;
//import android.content.pm.ActivityInfo;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.facebook.react.modules.core.PermissionListener;
import com.imagepicker.permissions.OnImagePickerPermissionsCallback;

import mt.com.tvm.MainActivity;

public class SplashActivity extends AppCompatActivity implements OnImagePickerPermissionsCallback {
    private PermissionListener listener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        new Thread(new Runnable() {
            public void run() {
                doWork();
                startApp();
                finish();
            }
        }).start();
    }

    @Override
    public void setPermissionListener(PermissionListener listener)
    {
        this.listener = listener;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
        if (listener != null)
        {
            listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    private void doWork() {
        for (int progress=0; progress<100; progress+=25) {
            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void startApp() {
      Intent intent = new Intent(this, MainActivity.class);
      //intent.putExtra("screenOrientation", ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
      startActivity(intent);
    }
}

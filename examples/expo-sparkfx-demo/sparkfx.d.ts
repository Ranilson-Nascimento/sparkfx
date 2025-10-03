// Type declarations for SparkFX auto-patching
import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    fx?: string;
  }
  
  interface PressableProps {
    fx?: string;
  }
  
  interface TextProps {
    fx?: string;
  }
}

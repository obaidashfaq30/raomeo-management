import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BedDouble, Gauge, Search, Settings2, UserRound } from "lucide-react-native";
import DashboardScreen from "../screens/DashboardScreen";
import MoreScreen from "../screens/MoreScreen";
import ModuleListScreen from "../screens/ModuleListScreen";
import SearchScreen from "../screens/SearchScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8
        }
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: tabIcon(Gauge) }} />
      <Tab.Screen
        name="Rooms"
        component={ModuleListScreen}
        initialParams={{ moduleKey: "rooms" }}
        options={{ tabBarIcon: tabIcon(BedDouble) }}
      />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarIcon: tabIcon(Search) }} />
      <Tab.Screen
        name="Guests"
        component={ModuleListScreen}
        initialParams={{ moduleKey: "guests" }}
        options={{ tabBarIcon: tabIcon(UserRound) }}
      />
      <Tab.Screen name="More" component={MoreScreen} options={{ tabBarIcon: tabIcon(Settings2) }} />
    </Tab.Navigator>
  );
}

function tabIcon(Icon) {
  function TabBarIcon({ color, size }) {
    return <Icon color={color} size={size} />;
  }

  TabBarIcon.displayName = `${Icon.displayName || Icon.name || "Tab"}Icon`;
  return TabBarIcon;
}

import { BedDouble, Bell, CalendarDays, CalendarRange, ClipboardCheck, CreditCard, Soup, UserRound, Wrench } from "lucide-react-native";
import Screen from "../components/Screen";
import ActionCard from "../components/ActionCard";

const items = [
  { routeName: "Calendar", label: "Booking Calendar", detail: "Unified booking timeline", icon: CalendarRange },
  { moduleKey: "reservations", label: "Reservations", detail: "Bookings and allocation", icon: CalendarDays },
  { moduleKey: "frontDesk", label: "Front Desk", detail: "Arrivals and room status", icon: Bell },
  { moduleKey: "housekeeping", label: "Housekeeping", detail: "Cleaning schedules", icon: ClipboardCheck },
  { moduleKey: "invoices", label: "Billing", detail: "Invoices and payments", icon: CreditCard },
  { moduleKey: "foodBeverage", label: "Food & Beverage", detail: "Room service orders", icon: Soup },
  { moduleKey: "guests", label: "Guests", detail: "Profiles and loyalty", icon: UserRound },
  { moduleKey: "maintenance", label: "Maintenance", detail: "Tickets and room issues", icon: Wrench },
  { moduleKey: "rooms", label: "Room Inventory", detail: "Categories and availability", icon: BedDouble }
];

export default function MoreScreen({ navigation }) {
  return (
    <Screen title="More" subtitle="Operational modules">
      {items.map((item) => (
        <ActionCard
          detail={item.detail}
          icon={item.icon}
          key={item.routeName || item.moduleKey}
          label={item.label}
          onPress={() => {
            if (item.routeName) {
              navigation.navigate(item.routeName);
            } else {
              navigation.navigate("ModuleList", { moduleKey: item.moduleKey });
            }
          }}
        />
      ))}
    </Screen>
  );
}

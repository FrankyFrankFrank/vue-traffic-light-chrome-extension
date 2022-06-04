import { toRef } from "vue";

export default function NotificationsPlugin({ store }) {
  store.$state.permissionStatus = "default";
  store.permissionStatus = toRef(store.$state, "permissionStatus");
  store.askPermission = () => {
    Notification.requestPermission().then(function (result) {
      store.$state.permissionStatus = result;
      console.log(store.$state.permissionStatus);
    });
  };
  store.makeNotification = ({ title, body }) => {
    var img = "/to-do-notifications/img/icon-128.png";
    new Notification(title, {
      body,
      icon: img,
    });
  };
}

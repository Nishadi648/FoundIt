import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import AuthPage from "./pages/AuthPage";
import BrowsePage from "./pages/BrowsePage";
import ReportPage from "./pages/ReportPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MyReportsPage from "./pages/MyReportsPage";

export default function App() {
  const { user, route } = useApp();

  // Users must log in or register before using the app
  if (!user) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  let page;
  switch (route.page) {
    case "report":
      page = <ReportPage key={route.query?.type || "report"} />;
      break;
    case "item":
      page = <ItemDetailPage key={route.param} id={route.param} />;
      break;
    case "my-reports":
      page = <MyReportsPage />;
      break;
    default:
      page = <BrowsePage />;
  }

  return (
    <>
      <Navbar />
      <main>{page}</main>
      <footer className="footer">
        <div className="container">FoundIt · Lost &amp; Found Web Application · 2026</div>
      </footer>
      <Toast />
    </>
  );
}

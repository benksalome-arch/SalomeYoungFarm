import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// ======================
// Authentication
// ======================

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// ======================
// Dashboard
// ======================

import Dashboard from "./pages/Dashboard";

// ======================
// Goats
// ======================

import Goats from "./pages/Goats";
import AddGoat from "./pages/AddGoat";
import GoatProfile from "./pages/GoatProfile";
import EditGoat from "./pages/EditGoat";

import Health from "./pages/Health";
import AddHealthRecord from "./pages/AddHealthRecord";

import WeightHistory from "./pages/WeightHistory";
import AddWeightRecord from "./pages/AddWeightRecord";

import Breeding from "./pages/Breeding";
import AddBreeding from "./pages/AddBreeding";
import EditBreeding from "./pages/EditBreeding";

import Kidding from "./pages/kidding";
import EditKidding from "./pages/EditKidding";
import AddKidding from "./pages/AddKidding";
import GoatMortality from "./pages/GoatMortality";
import AddGoatMortality from "./pages/AddGoatMortality";
import EditGoatMortality from "./pages/EditGoatMortality";

// ======================
// Workers
// ======================

import Workers from "./pages/Workers";
import AddWorker from "./pages/AddWorker";
import EditWorker from "./pages/EditWorker";

// ======================
// Finance
// ======================

import Finance from "./pages/Finance";
import AddFinance from "./pages/AddFinance";
import EditFinance from "./pages/EditFinance";
import Receipts from "./pages/Receipts";

// ======================
// Inventory
// ======================

import Inventory from "./pages/Inventory";
import AddInventory from "./pages/AddInventory";
import EditInventory from "./pages/EditInventory";

// ======================
// Feed
// ======================

import Feed from "./pages/Feed";
import AddFeed from "./pages/AddFeed";
import EditFeed from "./pages/EditFeed";
import FeedUsage from "./pages/FeedUsage";
import AddFeedUsage from "./pages/AddFeedUsage";

// ======================
// Chickens
// ======================

import Chickens from "./pages/Chickens";
import AddChicken from "./pages/AddChicken";
import RegisterChickenFlock from "./pages/RegisterChickenFlock";
import EditChicken from "./pages/EditChicken";
import ChickenProfile from "./pages/ChickenProfile";

import ChickenMortality from "./pages/ChickenMortality";
import AddChickenMortality from "./pages/AddChickenMortality";
import EditChickenMortality from "./pages/EditChickenMortality";

import ChickenVaccinations from "./pages/ChickenVaccinations";
import AddChickenVaccination from "./pages/AddChickenVaccination";
import EditChickenVaccination from "./pages/EditChickenVaccination";

import EggProduction from "./pages/EggProduction";
import AddEggProduction from "./pages/AddEggProduction";
import EditEggProduction from "./pages/EditEggProduction";

import EggSales from "./pages/EggSales";
import AddEggSale from "./pages/AddEggSale";
import EditEggSale from "./pages/EditEggSale";

// ======================
// Rabbits
// ======================

import Rabbits from "./pages/Rabbits";
import EditRabbit from "./pages/EditRabbit";
import AddRabbit from "./pages/AddRabbit";
import RabbitProfile from "./pages/RabbitProfile";

import RabbitHealth from "./pages/RabbitHealth";
import AddRabbitHealth from "./pages/AddRabbitHealth";

import RabbitVaccinations from "./pages/RabbitVaccinations";
import AddRabbitVaccination from "./pages/AddRabbitVaccination";

import RabbitWeight from "./pages/RabbitWeight";
import AddRabbitWeight from "./pages/AddRabbitWeight";

import RabbitBreeding from "./pages/RabbitBreeding";
import AddRabbitBreeding from "./pages/AddRabbitBreeding";

import RabbitLitters from "./pages/RabbitLitters";
import AddRabbitLitter from "./pages/AddRabbitLitter";
import EditRabbitLitter from "./pages/EditRabbitLitter";

import RabbitMortality from "./pages/RabbitMortality";
import AddRabbitMortality from "./pages/AddRabbitMortality";

// ======================
// Other
// ======================

import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================
            LOGIN
        ====================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ======================
            REGISTER
        ====================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ======================
            FORGOT PASSWORD
        ====================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ======================
            PROTECTED APPLICATION
        ====================== */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* ======================
              Dashboard
          ====================== */}

          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* ======================
              GOAT MANAGEMENT
          ====================== */}

          <Route
            path="/goats"
            element={<Goats />}
          />

          <Route
            path="/goats/add"
            element={<AddGoat />}
          />

          <Route
            path="/goats/:id"
            element={<GoatProfile />}
          />

          <Route
            path="/goats/edit/:id"
            element={<EditGoat />}
          />

          {/* Goat Health */}

          <Route
            path="/goats/:id/health"
            element={<Health />}
          />

          <Route
            path="/goats/:id/health/add"
            element={<AddHealthRecord />}
          />

          {/* Goat Weight */}

          <Route
            path="/goats/:id/weight"
            element={<WeightHistory />}
          />

          <Route
            path="/goats/:id/weight/add"
            element={<AddWeightRecord />}
          />

          {/* Goat Breeding */}

          <Route
            path="/breeding"
            element={<Breeding />}
          />

          <Route
            path="/breeding/add"
            element={<AddBreeding />}
          />
<Route path="/breeding/:id/edit" element={<EditBreeding />} />

          <Route
            path="/kidding"
            element={<Kidding />}
          />

          <Route
            path="/kidding/add"
            element={<AddKidding />}
          />
          <Route
            path="/kidding/:id/edit"
            element={<EditKidding />}
          />

          <Route
            path="/breeding/:id/kidding"
            element={<AddKidding />}
          />

          {/* Goat Mortality */}

          <Route
            path="/goat-mortality"
            element={<GoatMortality />}
          />

          <Route
            path="/goat-mortality/add"
            element={<AddGoatMortality />}
          />

          <Route
            path="/goat-mortality/:id/edit"
            element={<EditGoatMortality />}
          />

          {/* ======================
              WORKERS
          ====================== */}

          <Route
            path="/workers"
            element={<Workers />}
          />

          <Route
            path="/workers/add"
            element={<AddWorker />}
          />

          <Route
            path="/workers/edit/:id"
            element={<EditWorker />}
          />

          {/* ======================
              FINANCE
          ====================== */}

          <Route
            path="/finance"
            element={<Finance />}
          />

          <Route
            path="/finance/add"
            element={<AddFinance />}
          />

          <Route
            path="/finance/edit/:id"
            element={<EditFinance />}
          />
          
          <Route
            path="/receipts"
            element={<Receipts />}
          />

          {/* ======================
              INVENTORY
          ====================== */}

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/inventory/add"
            element={<AddInventory />}
          />

          <Route
            path="/inventory/edit/:id"
            element={<EditInventory />}
          />

          {/* ======================
              FEED
          ====================== */}

          <Route
            path="/feed"
            element={<Feed />}
          />

          <Route
            path="/feed/add"
            element={<AddFeed />}
          />

          <Route
            path="/feed/edit/:id"
            element={<EditFeed />}
          />

          <Route
            path="/feed/usage"
            element={<FeedUsage />}
          />

          <Route
            path="/feed/usage/add"
            element={<AddFeedUsage />}
          />

          {/* ======================
              CHICKENS
          ====================== */}

          <Route
            path="/chickens"
            element={<Chickens />}
          />

          <Route
            path="/chickens/add"
            element={<AddChicken />}
          />

          <Route
            path="/chickens/flock"
            element={<RegisterChickenFlock />}
          />

          <Route
            path="/chickens/:id"
            element={<ChickenProfile />}
          />

          <Route
            path="/chickens/edit/:id"
            element={<EditChicken />}
          />

          {/* Chicken Mortality */}

          <Route
            path="/chicken-mortality"
            element={<ChickenMortality />}
          />

          <Route
            path="/chicken-mortality/add"
            element={<AddChickenMortality />}
          />

          <Route
            path="/chicken-mortality/:id/edit"
            element={<EditChickenMortality />}
          />

          {/* Chicken Vaccinations */}

          <Route
            path="/chicken-vaccinations"
            element={<ChickenVaccinations />}
          />

          <Route
            path="/chicken-vaccinations/add"
            element={<AddChickenVaccination />}
          />

          <Route
            path="/chicken-vaccinations/:id/edit"
            element={<EditChickenVaccination />}
          />

          {/* Egg Production */}

          <Route
            path="/egg-production"
            element={<EggProduction />}
          />

          <Route
            path="/egg-production/add"
            element={<AddEggProduction />}
          />

          <Route
            path="/egg-production/:id/edit"
            element={<EditEggProduction />}
          />

          {/* Egg Sales */}

          <Route
            path="/egg-sales"
            element={<EggSales />}
          />

          <Route
            path="/egg-sales/add"
            element={<AddEggSale />}
          />

          <Route
            path="/egg-sales/:id/edit"
            element={<EditEggSale />}
          />

          {/* ======================
              RABBITS
          ====================== */}

          <Route
            path="/rabbits"
            element={<Rabbits />}
          />
          <Route
            path="/rabbits/edit/:id"
            element={<EditRabbit />}
          />

          <Route
            path="/rabbits/add"
            element={<AddRabbit />}
          />

          <Route
            path="/rabbits/:id"
            element={<RabbitProfile />}
          />

          {/* Rabbit Health */}

          <Route
            path="/rabbits/:id/health"
            element={<RabbitHealth />}
          />

          <Route
            path="/rabbits/:id/health/add"
            element={<AddRabbitHealth />}
          />

          {/* Rabbit Weight */}

          <Route
            path="/rabbits/:id/weight"
            element={<RabbitWeight />}
          />

          <Route
            path="/rabbits/:id/weight/add"
            element={<AddRabbitWeight />}
          />

          {/* Rabbit Breeding */}

          <Route
            path="/rabbits/:id/breeding"
            element={<RabbitBreeding />}
          />

          <Route
            path="/rabbits/:id/breeding/add"
            element={<AddRabbitBreeding />}
          />

          {/* Rabbit Litters */}

          <Route
            path="/rabbit-litters"
            element={<RabbitLitters />}
          />

          <Route
            path="/rabbit-litters/add"
            element={<AddRabbitLitter />}
          />

          <Route
            path="/rabbit-litters/:id/edit"
            element={<EditRabbitLitter />}
          />

          {/* Rabbit Mortality */}

          <Route
            path="/rabbit-mortality"
            element={<RabbitMortality />}
          />

          <Route
            path="/rabbit-mortality/add"
            element={<AddRabbitMortality />}
          />

          {/* Rabbit Vaccinations */}

          <Route
            path="/rabbit-vaccinations"
            element={<RabbitVaccinations />}
          />

          <Route
            path="/rabbit-vaccinations/add"
            element={<AddRabbitVaccination />}
          />

          {/* ======================
              REPORTS
          ====================== */}

          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* ======================
              SETTINGS
          ====================== */}

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

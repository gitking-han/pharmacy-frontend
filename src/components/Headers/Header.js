import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const getAuthHeaders = () => ({
    "auth-token": localStorage.getItem("token"),
  });

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sale/all`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSales(data.sales);
      }
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/medicine/all`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMedicines(data.medicines);
      }
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    }
  };

  const fetchStockEntries = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stock-entry/all`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setStockEntries(data.entries || []);
      }
    } catch (err) {
      console.error("Failed to fetch stock entries:", err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchMedicines();
    fetchStockEntries();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // 🔹 Calculate today's sales
  const todaysSales = sales.filter(
    (sale) => sale.date && sale.date.startsWith(today)
  );

  const dailySales = todaysSales.reduce(
    (total, sale) => total + (sale.grandTotal || 0),
    0
  );

  const uniqueCustomers = new Set(
    sales
      .filter((sale) => sale.customerName?.trim())
      .map((sale) => sale.customerName.trim().toLowerCase())
  ).size;

  // 🔹 Calculate profit: sale - cost
  const dailyProfit = todaysSales.reduce((profit, sale) => {
    if (!Array.isArray(sale.items)) return profit;

    for (const item of sale.items) {
      const itemMedicineId =
        typeof item.medicine === "object"
          ? item.medicine?._id || item.medicine?.$oid
          : item.medicine;

      const medicine = medicines.find((m) => m._id === itemMedicineId);

      if (!medicine) {
        console.warn("❌ Medicine not found for item:", item);
        continue;
      }

      const barcode = medicine.barcode?.trim();

      const matchingStockEntries = stockEntries
        .filter(
          (entry) =>
            entry.barcode?.trim() === barcode &&
            new Date(entry.createdAt) <= new Date(sale.date)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const latestStock = matchingStockEntries[0];

      if (!latestStock) {
        console.warn("❌ No matching stock entry found for barcode:", barcode);
        continue;
      }

      const costPrice = latestStock.costPrice ?? 0;
      const salePrice = item.price ?? medicine.salePrice ?? 0;

      const itemProfit = (salePrice - costPrice) * item.quantity;
      profit += itemProfit;
    }

    return profit;
  }, 0);

  return (
    <div className="header bg-gradient-info pb-8 pt-0 pt-md-5">
      <Container fluid>
        <div className="header-body">
          <Row className="mt-5 align-items-stretch">
            <StatCard
              
              title="Daily Sales"
              icon="fas fa-chart-bar"
              color="danger"
              value={`Rs.${dailySales.toFixed(2)}`}
            />
            <StatCard
              title="Total Medicines"
              icon="fas fa-pills"
              color="warning"
              value={medicines.length}
            />
            <StatCard
              title="Profit"
              icon="fas fa-dollar-sign"
              color="success"
              value={`Rs.${dailyProfit.toFixed(2)}`}
            />
            <StatCard
              title="New Customers"
              icon="fas fa-users"
              color="info"
              value={uniqueCustomers}
            />
          </Row>
        </div>
      </Container>
    </div>
  );
};

const StatCard = ({ title, icon, color, value }) => (
  <Col lg="6" xl="3" className="mt-4">
    <Card className="card-stats mb-4 mb-xl-0 h-100">
      <CardBody className="d-flex flex-column justify-content-between h-100">
        <Row>
          <Col>
            <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
              {title}
            </CardTitle>
            <span className="h2 font-weight-bold mb-0">{value}</span>
          </Col>
          <Col className="col-auto">
            <div
              className={`icon icon-shape bg-${color} text-white rounded-circle shadow`}
            >
              <i className={icon} />
            </div>
          </Col>
        </Row>
        <p className="mt-3 mb-0 text-muted text-sm">
          <span className="text-success">
            <i className="fa fa-arrow-up" /> Updated now
          </span>
        </p>
      </CardBody>
    </Card>
  </Col>
);

export default Header;

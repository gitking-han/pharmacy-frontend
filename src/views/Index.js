import classnames from "classnames";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Line } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";

// Register necessary components for chart.js v4
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const Index = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [lowStockItems, setLowStockItems] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [salesOverview, setSalesOverview] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const fetchLowStockAndExpiryAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const medRes = await fetch(`${backendUrl}/api/medicine/all`, {
        headers: { "auth-token": token },
      });
      const medData = await medRes.json();
      const allMeds = medData.success ? medData.medicines : [];

      const stockRes = await fetch(`${backendUrl}/api/stock-entry/all`, {
        headers: { "auth-token": token },
      });
      const stockData = await stockRes.json();
      const allEntries = stockData.success ? stockData.entries : [];

      const today = new Date();
      const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const alerts = [];

      allMeds.forEach((med) => {
        const relatedEntries = allEntries.filter(
          (entry) => entry.medicine?._id === med._id
        );

        const totalQuantity = relatedEntries.reduce(
          (sum, entry) => sum + entry.quantity,
          0
        );

        const hasExpiringBatch = relatedEntries.some((entry) => {
          const expiry = new Date(entry.expiryDate);
          return expiry <= next30Days && expiry > today;
        });

        const isLowStock = totalQuantity < 10;

        if (isLowStock || hasExpiringBatch) {
          alerts.push({
            medicine: med,
            totalQuantity,
            hasExpiringBatch,
          });
        }
      });

      setLowStockItems(alerts);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    }
  };

  const fetchTopSellingItems = async () => {
    try {
      const token = localStorage.getItem("token");

      const medRes = await fetch(`${backendUrl}/api/medicine/all`, {
        headers: { "auth-token": token },
      });
      const medData = await medRes.json();
      const medicines = medData.success ? medData.medicines : [];

      const saleRes = await fetch(`${backendUrl}/api/sale/all`, {
        headers: { "auth-token": token },
      });
      const saleData = await saleRes.json();

      if (saleData.success) {
        const sales = saleData.sales;
        const saleSummary = [];

        sales.forEach((sale) => {
          sale.items?.forEach((item) => {
            const medId = typeof item.medicine === "object" ? item.medicine._id : item.medicine;
            const existing = saleSummary.find((s) => s.medicineId === medId);

            if (existing) {
              existing.quantity += item.quantity;
            } else {
              const med = medicines.find((m) => m._id === medId);
              if (med) {
                saleSummary.push({
                  medicineId: med._id,
                  name: med.brandName,
                  quantity: item.quantity,
                });
              }
            }
          });
        });

        const sorted = saleSummary.sort((a, b) => b.quantity - a.quantity);
        setTopItems(sorted.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching top selling items:", err);
    }
  };

  const fetchSalesOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/sale/all`, {
        headers: { "auth-token": token },
      });
      const data = await res.json();

      if (!data.success) return;

      const grouped = {};

      data.sales.forEach((sale) => {
        const date = new Date(sale.date).toLocaleDateString();
        if (!grouped[date]) {
          grouped[date] = 0;
        }
        grouped[date] += sale.grandTotal || 0;
      });

      const formatted = Object.entries(grouped)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([date, total]) => ({ date, total }));

      setSalesOverview(formatted);
    } catch (error) {
      console.error("Failed to fetch overview data:", error);
    }
  };

  useEffect(() => {
    fetchLowStockAndExpiryAlerts();
    fetchTopSellingItems();
    fetchSalesOverview();

    const interval = setInterval(() => {
      fetchLowStockAndExpiryAlerts();
      fetchTopSellingItems();
      fetchSalesOverview();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: salesOverview.map((entry) => entry.date),
    datasets: [
      {
        label: "Sales",
        data: salesOverview.map((entry) => entry.total),
        fill: false,
        backgroundColor: "#5e72e4",
        borderColor: "#5e72e4",
      },
    ],
  };

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-white">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-bold mt-2">Overview</h6>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          href="#"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  {salesOverview.length > 0 ? (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: "top",
                          },
                          title: {
                            display: true,
                            text: "Daily Sales Overview",
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Total Sales (Rs)",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Date",
                            },
                          },
                        },
                      }}
                    />
                  ) : (
                    <p className="text-muted">No sales data available</p>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Low Stock & Expiry Alerts</h3>
              </CardHeader>
              <CardBody>
                {lowStockItems.length === 0 ? (
                  <p className="text-muted">No low stock or expiring medicines</p>
                ) : (
                  <Table responsive className="table-flush">
                    <thead className="thead-light">
                      <tr>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item, idx) => {
                        const alertType =
                          item.totalQuantity < 10 && item.hasExpiringBatch
                            ? "Low Stock & Expiring Soon"
                            : item.totalQuantity < 10
                              ? "Low Stock"
                              : "Expiring Soon";

                        return (
                          <tr key={idx}>
                            <td>{item.medicine?.brandName || "Unknown"}</td>
                            <td>{item.totalQuantity}</td>
                            <td>
                              <span className={`text-${alertType.includes("Low Stock") ? "danger" : "warning"}`}>
                                {alertType}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Top 5 Fast Moving Items</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.length === 0 ? (
                    <tr>
                      <td colSpan="3">No sales data available</td>
                    </tr>
                  ) : (
                    topItems.map((item) => (
                      <tr key={item.medicineId}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="mr-2">{Math.min(item.quantity, 100)}%</span>
                            <Progress
                              max="100"
                              value={Math.min(item.quantity, 100)}
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;

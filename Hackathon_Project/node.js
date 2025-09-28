const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data structure based on your Excel file
const bankingData = {
  revenue: {
    title: "Revenue Trends (in Billions USD)",
    years: ["2020", "2021", "2022", "2023", "2024"],
    banks: [
      {
        name: "JPMorgan Chase",
        values: [129.8, 127.2, 154.8, 239.4, 270.8],
        growth: "+108.6%"
      },
      {
        name: "Bank of America",
        values: [85.5, 89.1, 89.1, 93.5, 94.2],
        growth: "+10.2%"
      },
      {
        name: "Wells Fargo",
        values: [72.3, 78.5, 83.4, 115.3, 125.4],
        growth: "+73.4%"
      },
      {
        name: "Citigroup",
        values: [74.3, 79.9, 101.1, 156.8, 170.8],
        growth: "+129.8%"
      },
      {
        name: "U.S. Bank",
        values: [23.0, 23.7, 27.4, 40.6, 42.7],
        growth: "+85.7%"
      }
    ]
  },
  netIncome: {
    title: "Net Income Trends (in Billions USD)",
    years: ["2020", "2021", "2022", "2023", "2024"],
    banks: [
      {
        name: "JPMorgan Chase",
        values: [29.1, 48.3, 35.9, 47.8, 58.5],
        growth: "+101.0%"
      },
      {
        name: "Bank of America",
        values: [17.9, 32.0, 27.5, 26.5, 27.1],
        growth: "+51.4%"
      },
      {
        name: "Wells Fargo",
        values: [3.0, 21.5, 13.2, 15.9, 19.7],
        growth: "+556.7%"
      },
      {
        name: "Citigroup",
        values: [11.1, 20.8, 13.7, 7.9, 11.5],
        growth: "+3.6%"
      },
      {
        name: "U.S. Bank",
        values: [6.1, 7.6, 5.5, 5.1, 5.9],
        growth: "-3.3%"
      }
    ]
  },
  totalAssets: {
    title: "Total Assets Trends (in Trillions USD)",
    years: ["2020", "2021", "2022", "2023", "2024"],
    banks: [
      {
        name: "JPMorgan Chase",
        values: [3.2, 3.7, 3.7, 3.9, 4.0],
        growth: "+25.0%"
      },
      {
        name: "Bank of America",
        values: [2.8, 3.2, 3.1, 3.2, 3.3],
        growth: "+17.9%"
      },
      {
        name: "Wells Fargo",
        values: [1.9, 1.9, 1.9, 1.9, 1.9],
        growth: "0.0%"
      },
      {
        name: "Citigroup",
        values: [2.3, 2.3, 2.4, 2.4, 2.4],
        growth: "+4.3%"
      },
      {
        name: "U.S. Bank",
        values: [0.6, 0.7, 0.7, 0.7, 0.7],
        growth: "+16.7%"
      }
    ]
  },
  roe: {
    title: "Return on Equity (ROE) Trends (%)",
    years: ["2020", "2021", "2022", "2023", "2024"],
    banks: [
      {
        name: "JPMorgan Chase",
        values: [9.7, 18.3, 13.2, 17.8, 22.0],
        trend: "Strengthening"
      },
      {
        name: "Bank of America",
        values: [6.6, 12.4, 10.8, 10.2, 10.8],
        trend: "Stable"
      },
      {
        name: "Wells Fargo",
        values: [1.4, 10.8, 6.8, 8.3, 10.3],
        trend: "Recovering"
      },
      {
        name: "Citigroup",
        values: [5.1, 9.8, 6.4, 3.7, 5.4],
        trend: "Volatile"
      },
      {
        name: "U.S. Bank",
        values: [11.8, 14.2, 10.2, 9.4, 10.8],
        trend: "Stable"
      }
    ]
  },
  marketCap: {
    title: "Market Capitalization Trends (in Billions USD)",
    years: ["2020", "2021", "2022", "2023", "2024"],
    banks: [
      {
        name: "JPMorgan Chase",
        values: [381.5, 507.8, 420.7, 491.8, 787.9],
        growth: "+106.5%"
      },
      {
        name: "Bank of America",
        values: [267.4, 375.8, 315.2, 298.5, 356.7],
        growth: "+33.4%"
      },
      {
        name: "Wells Fargo",
        values: [120.3, 195.4, 156.8, 161.2, 209.8],
        growth: "+74.4%"
      },
      {
        name: "Citigroup",
        values: [125.8, 148.9, 95.7, 93.2, 123.4],
        growth: "-1.9%"
      },
      {
        name: "U.S. Bank",
        values: [66.2, 75.3, 58.9, 58.1, 72.8],
        growth: "+10.0%"
      }
    ]
  }
};

// API Routes

// Get all available metrics
app.get('/api/metrics', (req, res) => {
  const metrics = Object.keys(bankingData).map(key => ({
    id: key,
    title: bankingData[key].title,
    bankCount: bankingData[key].banks.length
  }));
  res.json(metrics);
});

// Get all data
app.get('/api/data', (req, res) => {
  res.json(bankingData);
});

// Get specific metric data
app.get('/api/data/:metric', (req, res) => {
  const { metric } = req.params;
  
  if (!bankingData[metric]) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  
  res.json(bankingData[metric]);
});

// Get data for specific bank across all metrics
app.get('/api/bank/:bankName', (req, res) => {
  const { bankName } = req.params;
  const decodedBankName = decodeURIComponent(bankName);
  
  const bankData = {};
  
  Object.keys(bankingData).forEach(metric => {
    const bank = bankingData[metric].banks.find(b => 
      b.name.toLowerCase() === decodedBankName.toLowerCase()
    );
    if (bank) {
      bankData[metric] = {
        title: bankingData[metric].title,
        years: bankingData[metric].years,
        data: bank
      };
    }
  });
  
  if (Object.keys(bankData).length === 0) {
    return res.status(404).json({ error: 'Bank not found' });
  }
  
  res.json({
    bankName: decodedBankName,
    metrics: bankData
  });
});

// Get comparison between banks for specific metric
app.get('/api/compare/:metric', (req, res) => {
  const { metric } = req.params;
  const { banks } = req.query; // comma-separated bank names
  
  if (!bankingData[metric]) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  
  if (!banks) {
    return res.json(bankingData[metric]);
  }
  
  const bankNames = banks.split(',').map(name => name.trim());
  const filteredBanks = bankingData[metric].banks.filter(bank =>
    bankNames.some(name => bank.name.toLowerCase().includes(name.toLowerCase()))
  );
  
  res.json({
    title: bankingData[metric].title,
    years: bankingData[metric].years,
    banks: filteredBanks
  });
});

// Get trend analysis for all banks in a specific metric
app.get('/api/trends/:metric', (req, res) => {
  const { metric } = req.params;
  
  if (!bankingData[metric]) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  
  const trends = bankingData[metric].banks.map(bank => {
    const values = bank.values;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const totalGrowth = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
    
    // Calculate year-over-year growth rates
    const yoyGrowth = [];
    for (let i = 1; i < values.length; i++) {
      const growth = ((values[i] - values[i-1]) / values[i-1] * 100).toFixed(1);
      yoyGrowth.push(parseFloat(growth));
    }
    
    return {
      name: bank.name,
      totalGrowth: `${totalGrowth}%`,
      averageYoYGrowth: `${(yoyGrowth.reduce((a, b) => a + b, 0) / yoyGrowth.length).toFixed(1)}%`,
      yoyGrowthRates: yoyGrowth,
      currentValue: lastValue,
      trend: bank.trend || (totalGrowth > 0 ? 'Growing' : 'Declining')
    };
  });
  
  res.json({
    metric: bankingData[metric].title,
    trends: trends.sort((a, b) => parseFloat(b.totalGrowth) - parseFloat(a.totalGrowth))
  });
});

// Get summary statistics
app.get('/api/summary', (req, res) => {
  const summary = {};
  
  Object.keys(bankingData).forEach(metric => {
    const data = bankingData[metric];
    const allValues = data.banks.flatMap(bank => bank.values);
    const currentYearValues = data.banks.map(bank => bank.values[bank.values.length - 1]);
    
    summary[metric] = {
      title: data.title,
      totalBanks: data.banks.length,
      averageCurrentValue: (currentYearValues.reduce((a, b) => a + b, 0) / currentYearValues.length).toFixed(2),
      topPerformer: data.banks.reduce((top, bank) => {
        const currentValue = bank.values[bank.values.length - 1];
        return currentValue > (top.values[top.values.length - 1]) ? bank : top;
      }).name,
      range: {
        min: Math.min(...currentYearValues).toFixed(2),
        max: Math.max(...currentYearValues).toFixed(2)
      }
    };
  });
  
  res.json(summary);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Banking Data API server running on port ${port}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /api/data - Get all banking data`);
  console.log(`  GET /api/metrics - Get available metrics`);
  console.log(`  GET /api/data/:metric - Get specific metric data`);
  console.log(`  GET /api/bank/:bankName - Get all data for specific bank`);
  console.log(`  GET /api/compare/:metric?banks=bank1,bank2 - Compare banks`);
  console.log(`  GET /api/trends/:metric - Get trend analysis`);
  console.log(`  GET /api/summary - Get summary statistics`);
  console.log(`  GET /health - Health check`);
});

module.exports = app;
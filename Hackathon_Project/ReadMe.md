# Banking Data Visualization Backend

A robust Node.js/Express API backend for visualizing banking financial data from Excel spreadsheets. This backend processes your 5-year banking analysis data and provides RESTful endpoints for frontend consumption.

## 🚀 Features

- **Excel File Processing**: Automatically parse and structure Excel data
- **RESTful API**: Comprehensive endpoints for data visualization
- **Real-time Upload**: Process new Excel files via API
- **Data Validation**: Robust error handling and data validation
- **Performance**: Optimized with caching, compression, and rate limiting
- **Security**: Helmet, CORS, and file upload restrictions
- **Docker Support**: Easy containerized deployment
- **Production Ready**: Health checks, logging, and graceful shutdown

## 📊 Data Structure Support

Based on your Excel file, the backend handles:

- **Revenue Trends** (in Billions USD)
- **Net Income Trends** (in Billions USD) 
- **Total Assets Trends** (in Trillions USD)
- **Return on Equity (ROE) Trends** (%)
- **Market Capitalization Trends** (in Billions USD)
- **Strategic Positioning** (qualitative data)

Supports the top 5 US banks: JPMorgan Chase, Bank of America, Wells Fargo, Citigroup, and U.S. Bank.

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Your Excel file with banking data

### Quick Start

1. **Clone and Install**
```bash
git clone <your-repo>
cd banking-data-backend
npm install
```

2. **Process Your Excel Data**
```bash
# Process your Excel file
node data_processor.js "./complete analysis.xlsx" "./data/banking_data.json"
```

3. **Start the Server**
```bash
# Development
npm run dev

# Production
npm start
```

4. **Verify Setup**
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

### Environment Configuration

Create a `.env` file:
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000,http://localhost:5173
```

## 🔌 API Endpoints

### Core Data Endpoints

```http
GET /api/data
# Returns all banking data

GET /api/metrics  
# Returns available metrics overview

GET /api/data/:metric
# Returns specific metric data
# metrics: revenue, netIncome, totalAssets, roe, marketCap
```

### Bank-Specific Endpoints

```http
GET /api/bank/:bankName
# Returns all metrics for specific bank
# Example: /api/bank/JPMorgan%20Chase

GET /api/banks
# Returns list of all available banks
```

### Analysis Endpoints

```http
GET /api/compare/:metric?banks=bank1,bank2
# Compare specific banks for a metric
# Example: /api/compare/revenue?banks=JPMorgan Chase,Bank of America

GET /api/trends/:metric
# Returns trend analysis with growth rates and patterns
# Example: /api/trends/revenue

GET /api/summary
# Returns summary statistics across all metrics
```

### File Upload Endpoint

```http
POST /api/upload
# Upload and process new Excel file
# Content-Type: multipart/form-data
# Field name: excel
```

### Utility Endpoints

```http
GET /health
# Health check and system status

GET /api
# API documentation and endpoint list
```

## 📝 API Response Examples

### Get Revenue Data
```http
GET /api/data/revenue
```

```json
{
  "title": "Revenue Trends (in Billions USD)",
  "years": ["2020", "2021", "2022", "2023", "2024"],
  "banks": [
    {
      "name": "JPMorgan Chase",
      "values": [129.8, 127.2, 154.8, 239.4, 270.8],
      "growth": "+108.6%"
    }
  ]
}
```

### Compare Banks
```http
GET /api/compare/revenue?banks=JPMorgan Chase,Bank of America
```

### Trend Analysis
```http
GET /api/trends/revenue
```

```json
{
  "metric": "Revenue Trends (in Billions USD)",
  "trends": [
    {
      "name": "JPMorgan Chase",
      "totalGrowth": "+108.6%",
      "averageYoYGrowth": "+21.7%",
      "yoyGrowthRates": [-2.0, 21.7, 54.6, 13.1],
      "currentValue": 270.8,
      "trend": "Growing"
    }
  ]
}
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f banking-api

# Stop services
docker-compose down
```

### Using Docker Only

```bash
# Build image
docker build -t banking-api .

# Run container
docker run -d \
  --name banking-api \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  banking-api
```

## 🔧 Frontend Integration

### JavaScript/React Example

```javascript
// Fetch all revenue data
const response = await fetch('http://localhost:3000/api/data/revenue');
const revenueData = await response.json();

// Upload new Excel file
const formData = new FormData();
formData.append('excel', file);

const uploadResponse = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  body: formData
});
```

### Chart.js Integration Example

```javascript
// Format data for Chart.js
function formatChartData(apiData) {
  return {
    labels: apiData.years,
    datasets: apiData.banks.map((bank, index) => ({
      label: bank.name,
      data: bank.values,
      borderColor: `hsl(${index * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.1)`,
      tension: 0.1
    }))
  };
}

// Fetch and create chart
fetch('/api/data/revenue')
  .then(response => response.json())
  .then(data => {
    const chartData = formatChartData(data);
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: data.title
          }
        }
      }
    });
  });
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Upload Validation**: Only Excel files, 10MB max
- **CORS Configuration**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation for critical endpoints
- **Error Handling**: Secure error responses

## 📈 Performance Optimizations

- **Compression**: Gzip compression enabled
- **Caching**: In-memory data caching
- **File Processing**: Efficient Excel parsing
- **Response Optimization**: Minimal data transfer

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test specific endpoint
curl -X GET http://localhost:3000/api/data/revenue
```

## 🔄 Data Updates

### Method 1: File Upload API
```bash
curl -X POST \
  -F "excel=@./new_data.xlsx" \
  http://localhost:3000/api/upload
```

### Method 2: Direct File Processing
```bash
node data_processor.js "./new_data.xlsx" "./data/banking_data.json"
# Restart server to reload data
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-api-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📁 Project Structure

```
banking-data-backend/
├── server.js              # Main server file
├── data_processor.js      # Excel processing utility
├── package.json           # Dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Multi-service setup
├── .env                  # Environment variables
├── data/                 # Processed data storage
├── uploads/              # Temporary file uploads
├── tests/                # Test files
└── docs/                 # Additional documentation
```

## 🤝 Integration with AI Agent

The backend is designed to work seamlessly with AI agents:

```javascript
// AI Agent can fetch and analyze data
const summaryData = await fetch('/api/summary').then(r => r.json());
const trends = await fetch('/api/trends/revenue').then(r => r.json());

// AI can process and provide insights
const insights = analyzeFinancialTrends(summaryData, trends);
```

## 🐛 Troubleshooting

### Common Issues

1. **Data Not Loading**
   ```bash
   # Check if data file exists
   ls -la data/banking_data.json
   
   # Process Excel file again
   node data_processor.js "./complete analysis.xlsx"
   ```

2. **File Upload Fails**
   - Ensure file is Excel format (.xlsx or .xls)
   - Check file size (max 10MB)
   - Verify uploads directory exists and is writable

3. **CORS Issues**
   - Update FRONTEND_URL in .env
   - Check browser console for specific CORS errors

4. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process or use different port
   PORT=3001 npm start
   ```

## 📚 Next Steps

1. **Frontend Development**: Use the API endpoints to build your visualization frontend
2. **AI Integration**: Connect your AI agent to analyze and provide insights
3. **Data Expansion**: Add more banks or metrics by updating Excel file
4. **Real-time Updates**: Implement WebSocket for real-time data updates
5. **Authentication**: Add user management if needed

## 📞 Support

For questions about the banking data backend:
- Check the API documentation at `/api`
- Review the health check at `/health`
- Examine server logs for debugging
- Test endpoints with curl or Postman

---

**Ready to visualize your banking data!** 🏦📊
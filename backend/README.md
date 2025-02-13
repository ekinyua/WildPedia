# Biodiversity API Backend

Backend service for the Biodiversity Awareness Application, providing species data through integration with the GBIF API.

## Technology Stack

- Node.js, Express.js, GBIF API Integration

## Setup

1. Clone the repository
```bash
git clone https://github.com/ekinyua/WildPedia.git
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm run dev
```

## API Documentation

### GET /api/species

Fetches species information from the GBIF API.

#### Query Parameters

- `q` (string, optional)
  - Use "random" for default species list
  - Use specific terms to search for particular species

#### Response Format

```json
{
  "results": [
    {
      "key": "number",
      "scientificName": "string",
      "rank": "string",
      "kingdom": "string",
      "image": "string | null"
    }
  ]
}
```

#### Error Responses

- 500 Internal Server Error
```json
{
  "error": "error message"
}
```

## Features

- GBIF API integration for species data
- Image fetching for species
- Error handling
- CORS enabled for frontend integration
- Environment variable configuration


## License

This project is licensed under the MIT License - see the LICENSE file for details.
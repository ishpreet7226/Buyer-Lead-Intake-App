# LeadFlow - Modern Buyer Lead Management

A beautiful, modern Next.js application for managing buyer leads and property inquiries. Built with TypeScript, Prisma, and cutting-edge web technologies with a focus on user experience and visual design.

## Features

### Core Functionality
- **Lead Management**: Create, view, edit, and delete buyer leads
- **Advanced Search & Filtering**: Search by name, email, phone, or notes with URL-synced filters
- **Pagination**: Server-side pagination with configurable page sizes
- **CSV Import/Export**: Bulk import leads and export filtered results
- **Ownership Control**: Users can only edit their own leads
- **Change History**: Track all changes to leads with detailed audit logs

### Data Model
- **Buyers**: Complete lead information including contact details, property preferences, budget, and timeline
- **Users**: Simple authentication system with email-based login
- **Buyer History**: Audit trail for all lead modifications

### Validation & Safety
- **Client & Server Validation**: Zod schemas ensure data integrity
- **Ownership Enforcement**: Users can only modify their own leads
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: Comprehensive error boundaries and user feedback

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with validation
- **Testing**: Jest with React Testing Library

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buyer-lead-intake
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Add sample data (optional but recommended)**
   ```bash
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

The app uses SQLite for development. The database file (`dev.db`) will be created automatically when you run the first migration.

To reset the database and add sample data:
```bash
npm run db:reset
```

This will reset the database and automatically seed it with sample data.

## Usage

### Authentication
- Simple email-based authentication
- No password required for demo purposes
- Enter any email address to log in

### Managing Leads

1. **Create a Lead**
   - Navigate to "New Lead" or click the "+" button
   - Fill in the required information
   - BHK is required for Apartment and Villa properties
   - Budget validation ensures max ≥ min

2. **View & Edit Leads**
   - Click on any lead in the list to view details
   - Edit button allows modification of lead information
   - Only the lead owner can edit/delete

3. **Search & Filter**
   - Use the search bar for full-text search
   - Apply filters for city, property type, status, and timeline
   - Filters are synced with URL for bookmarking

4. **Import/Export**
   - Import CSV files with lead data
   - Download template for correct format
   - Export current filtered results

### CSV Import Format

Required headers:
```
fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
```

Sample data:
```
John Doe,john@example.com,9876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThree,Website,Interested in 2BHK,premium,New
```

## API Endpoints

### Buyers
- `GET /api/buyers` - List buyers with pagination and filters
- `POST /api/buyers` - Create a new buyer
- `GET /api/buyers/[id]` - Get buyer details
- `PUT /api/buyers/[id]` - Update buyer
- `DELETE /api/buyers/[id]` - Delete buyer

### Import/Export
- `POST /api/buyers/import` - Import buyers from CSV
- `GET /buyers/export` - Export buyers to CSV

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── buyers/         # Buyer management pages
│   └── login/          # Authentication
├── components/         # React components
├── lib/               # Utilities and configurations
│   ├── __tests__/     # Unit tests
│   ├── schemas.ts     # Zod validation schemas
│   ├── db.ts          # Database connection
│   ├── auth.ts        # Authentication utilities
│   └── buyer-utils.ts # Business logic
└── prisma/            # Database schema and migrations
```

### Running Tests
```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

### Database Management
```bash
npx prisma studio     # Open database GUI
npx prisma migrate dev # Create and apply migrations
npx prisma generate   # Generate Prisma client
```

## Design Decisions

### Validation Strategy
- **Client-side**: Immediate feedback using React Hook Form + Zod
- **Server-side**: API routes validate all inputs before database operations
- **Database**: Prisma schema enforces data types and constraints

### SSR vs Client-side
- **List Page**: Server-side rendering for SEO and performance
- **Forms**: Client-side for better UX and validation
- **Search/Filter**: Hybrid approach with URL sync

### Ownership Enforcement
- All database operations check `ownerId` against current user
- API routes validate ownership before allowing modifications
- UI shows appropriate actions based on ownership

### Error Handling
- Form validation errors shown inline
- API errors displayed as toast notifications
- Error boundaries catch unexpected errors
- Graceful fallbacks for missing data

## Modern UI Features

### Design System
- **Modern Color Palette**: Carefully crafted color scheme with gradients and proper contrast
- **Smooth Animations**: Micro-interactions and transitions for better user experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader support

### Visual Enhancements
- **Avatar System**: Colorful user avatars with initials
- **Status Badges**: Beautiful status indicators with appropriate colors
- **Card-based Layout**: Clean, modern card design throughout the application
- **Gradient Backgrounds**: Subtle gradients for visual depth
- **Custom Scrollbars**: Styled scrollbars for better aesthetics

### Interactive Elements
- **Hover Effects**: Smooth hover transitions on interactive elements
- **Loading States**: Beautiful loading spinners and skeleton screens
- **Form Validation**: Real-time validation with helpful error messages
- **Filter Indicators**: Visual indicators showing active filters

## Nice-to-Have Features Implemented

1. **Status Quick Actions**: Dropdown for quick status updates
2. **Tag Input with Typeahead**: Smart tag input with suggestions
3. **Advanced Search**: Comprehensive search and filter interface
4. **Sample Data**: Realistic sample data for immediate testing

## What's Done vs Skipped

### ✅ Completed
- All core CRUD operations
- Advanced search and filtering
- CSV import/export with validation
- Ownership-based access control
- Change history tracking
- Form validation (client + server)
- Pagination and sorting
- Unit tests
- Error handling and accessibility

### ⏭️ Skipped (Optional)
- File upload for attachments
- Email notifications
- Advanced reporting
- Real-time updates
- Mobile app
- Advanced user roles

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set up environment variables
3. Deploy automatically on push

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Ensure database is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
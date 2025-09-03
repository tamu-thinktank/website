# General Member Application Documentation

**Route**: `/apply`  
**Component**: `/src/app/apply/page.tsx`  
**Purpose**: Multi-step application form for students applying to join Think Tank design challenge teams  

## Overview

The general member application is the primary entry point for students interested in joining Think Tank. It features a comprehensive multi-tab interface with form persistence, real-time validation, and seamless user experience.

## Page Architecture

### Component Structure
```
apply/
├── page.tsx                    # Main application component
└── _sections/                  # Application sections
    ├── intro.tsx              # Introduction and instructions
    ├── personal.tsx           # Personal information
    ├── academic.tsx           # Academic background
    ├── resume.tsx             # Resume upload
    ├── thinkTankInfo.tsx      # Team interests and experience
    ├── availability.tsx       # Interview availability
    ├── openEndedQuestions.tsx # Essay responses
    └── confirmation.tsx       # Review and submission
```

## Application Flow

### Tab-Based Navigation
The application uses a 7-tab interface with progress tracking:

1. **Introduction** - Welcome and instructions
2. **Personal Info** - Contact details and demographics  
3. **Academic Info** - Education and technical background
4. **Resume** - PDF upload and validation
5. **Think Tank Info** - Team preferences and experience
6. **Availability** - Interview scheduling preferences  
7. **Review** - Final confirmation and submission

### Progress Tracking
- Visual progress bar showing completion percentage
- Tab validation states (complete/incomplete/current)
- Ability to navigate between completed sections
- Auto-save functionality to prevent data loss

## Form Implementation

### Technology Stack
- **Form Management**: React Hook Form with TypeScript
- **Validation**: Zod schemas with runtime type checking
- **Persistence**: Local storage with custom hook `usePersistForm`
- **API Communication**: tRPC for type-safe API calls
- **File Upload**: Custom upload handling with progress tracking

### Form Schema
```typescript
// From /lib/validations/dcmember-apply.ts
const DCMemberApplyFormSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z.string().optional(),
  
  // Academic Information  
  major: z.string().min(1, "Major is required"),
  year: z.enum(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]),
  gpa: z.number().min(0).max(4.0).optional(),
  
  // Technical Background
  programmingLanguages: z.array(z.string()),
  softwareTools: z.array(z.string()),
  
  // Experience and Motivation
  previousExperience: z.string().optional(),
  whyJoinThinkTank: z.string().min(50, "Please provide at least 50 characters"),
  designExperience: z.string().optional(),
  
  // Team Preferences (ranked 1-3)
  teamPreferences: z.array(z.object({
    team: z.enum([...OfficerPositions]),
    priority: z.number().min(1).max(3)
  })).min(1, "Please select at least one team preference"),
  
  // Availability Matrix
  availability: z.record(z.record(z.boolean())),
  
  // File Upload
  resumeFile: z.instanceof(File).optional(),
  resumeUrl: z.string().url().optional(),
  
  // Optional Links
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  personalWebsite: z.string().url().optional()
});
```

## Section Details

### 1. Personal Information (`personal.tsx`)

#### Fields Collected
- **Full Name**: Required, minimum 2 characters
- **Email**: Required, must be valid email format  
- **Phone Number**: Optional, formatted input
- **Demographics**: Optional diversity information

#### Validation Rules
- Email uniqueness checked against existing applications
- Phone number format validation (US format preferred)
- Real-time validation feedback

#### Database Storage
```typescript
// Stored in Application model
{
  fullName: string,
  email: string,
  phoneNumber: string | null
}
```

### 2. Academic Information (`academic.tsx`)

#### Fields Collected
- **Major**: Required dropdown with common majors
- **Academic Year**: Required selection (Freshman through Graduate)
- **GPA**: Optional, 0.0-4.0 scale with 2 decimal places
- **Expected Graduation**: Semester and year

#### Special Features
- **Major Autocomplete**: Searchable dropdown with common TAMU majors
- **GPA Validation**: Prevents impossible values
- **Graduation Calculator**: Auto-suggests graduation based on current year

#### Database Storage
```typescript
{
  major: string,
  year: string,
  gpa: number | null,
  expectedGraduation: string | null
}
```

### 3. Resume Upload (`resume.tsx`)

#### File Requirements
- **Format**: PDF files only
- **Size Limit**: 5MB maximum
- **Naming**: Auto-renamed to prevent conflicts

#### Upload Process
1. **Client Validation**: Check file type and size
2. **Upload API**: `POST /api/upload-resume`
3. **Storage**: Secure file storage with unique naming
4. **Database Link**: Store file URL in application record

#### Error Handling
- File too large warnings
- Invalid format rejection
- Upload failure retry mechanism
- Progress indication during upload

#### Database Storage
```typescript
{
  resumeUrl: string | null
}
```

### 4. Think Tank Information (`thinkTankInfo.tsx`)

#### Team Preferences
- **Selection**: Choose 1-3 preferred teams
- **Ranking**: Priority ranking (1st, 2nd, 3rd choice)
- **Team Descriptions**: Information about each team's focus

#### Available Teams
- **Software Team**: Web development, mobile apps, automation
- **Mechanical Team**: CAD design, manufacturing, prototyping  
- **Electrical Team**: Circuit design, embedded systems, PCBs
- **MateROV Team**: Underwater robotics competition
- **Marketing Team**: Social media, outreach, design
- **Operations Team**: Event planning, logistics, coordination

#### Experience Questions
- **Previous Experience**: Open text about relevant background
- **Design Experience**: Specific design/engineering projects
- **Technical Skills**: Programming languages, software tools

#### Database Storage
```typescript
// SubteamPreference model
{
  id: string,
  applicationId: string,
  subteam: OfficerPosition,
  priority: number
}

// Application model fields
{
  previousExperience: string | null,
  whyJoinThinkTank: string,
  designExperience: string | null,
  programmingLanguages: string[],
  softwareTools: string[]
}
```

### 5. Availability (`availability.tsx`)

#### Time Grid Interface
- **Days**: Monday through Friday
- **Hours**: 8:00 AM to 10:00 PM in 15-minute increments
- **Selection**: Click to toggle availability
- **Visual**: Color-coded available/unavailable blocks

#### Grid Features
- **Bulk Selection**: Click and drag to select multiple slots
- **Day Selection**: Select/deselect entire days
- **Time Range**: Select common time ranges (morning, afternoon, evening)
- **Clear All**: Reset entire availability grid

#### Database Storage
```typescript
// Stored as JSON object
{
  availability: {
    [day: string]: {
      [time: string]: boolean
    }
  }
}

// Example structure
{
  "monday": {
    "08:00": true,
    "08:15": true,
    "08:30": false,
    // ... all time slots
  },
  "tuesday": {
    // ... time slots
  }
}
```

### 6. Open-Ended Questions (`openEndedQuestions.tsx`)

#### Required Essays
1. **Why Think Tank?** (Required, min 50 characters)
   - Motivation for joining
   - Understanding of organization
   - Personal goals

2. **Relevant Experience** (Optional)
   - Previous projects
   - Leadership experience
   - Technical accomplishments

3. **Design Philosophy** (Optional)
   - Approach to problem-solving
   - Design thinking process
   - Innovation examples

#### Text Editor Features
- **Character Counters**: Live count with minimum requirements
- **Auto-Save**: Periodic saving to prevent loss
- **Rich Text**: Basic formatting support
- **Spell Check**: Browser-native spell checking

#### Database Storage
```typescript
{
  whyJoinThinkTank: string,
  previousExperience: string | null,
  designExperience: string | null
}
```

### 7. Review and Confirmation (`confirmation.tsx`)

#### Review Process
- **Summary Display**: All entered information in organized sections
- **Edit Links**: Quick navigation back to specific sections
- **Validation Check**: Ensure all required fields complete
- **Terms Agreement**: Required acknowledgment of terms

#### Submission Process
1. **Final Validation**: Complete form validation
2. **Data Submission**: API call to create application
3. **Status Update**: Confirmation of successful submission
4. **Email Confirmation**: Automatic confirmation email sent
5. **Redirect**: Navigate to success page or dashboard

## Form Persistence

### Implementation
Uses custom `usePersistForm` hook to save form data to local storage:

```typescript
// Auto-save functionality
const { persistForm, clearPersistedData } = usePersistForm("dcmember-apply");

// Triggered on form value changes
useEffect(() => {
  const subscription = watch((values) => {
    persistForm(values);
  });
  return () => subscription.unsubscribe();
}, [watch, persistForm]);
```

### Storage Strategy
- **Key**: `dcmember-apply` in localStorage
- **Data**: Complete form state as JSON
- **Cleanup**: Cleared on successful submission
- **Restoration**: Auto-loaded on page refresh

### Benefits
- Prevents data loss on browser refresh
- Allows users to complete application over multiple sessions
- Maintains progress across browser crashes
- Reduces re-entry frustration

## API Integration

### Primary API Calls

#### Application Submission
```typescript
const { mutate: submitApplication } = api.applications.submit.useMutation({
  onSuccess: () => {
    clearPersistedData();
    router.push('/apply/success');
  },
  onError: (error) => {
    toast({
      title: "Submission Failed",
      description: error.message,
      variant: "destructive"
    });
  }
});
```

#### Resume Upload
```typescript
const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await fetch('/api/upload-resume', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const { url } = await response.json();
  return url;
};
```

#### Email Validation
```typescript
const { data: isEmailTaken } = api.applications.checkEmail.useQuery(
  { email: watchedEmail },
  { enabled: !!watchedEmail && isValidEmail(watchedEmail) }
);
```

## User Experience Features

### Progress Indication
- **Progress Bar**: Visual completion percentage
- **Tab States**: Completed/current/pending indicators  
- **Save Indicators**: Auto-save status display
- **Validation Feedback**: Real-time error highlighting

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Proper focus ordering

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface
- **Tablet Support**: Optimized for medium screens
- **Desktop Enhanced**: Full feature set on large screens
- **Print Friendly**: Printable review format

## Error Handling

### Client-Side Validation
```typescript
// Field-level validation
const fieldError = errors.fullName?.message;

// Section-level validation  
const isPersonalSectionValid = !errors.fullName && !errors.email;

// Form-level validation
const canSubmit = isValid && !isSubmitting;
```

### API Error Handling
```typescript
const handleSubmissionError = (error: TRPCError) => {
  if (error.code === 'CONFLICT') {
    setError('email', { message: 'Email already registered' });
  } else if (error.code === 'BAD_REQUEST') {
    toast({ 
      title: 'Validation Error',
      description: 'Please check your information and try again',
      variant: 'destructive'
    });
  } else {
    toast({
      title: 'Submission Failed', 
      description: 'Please try again or contact support',
      variant: 'destructive'
    });
  }
};
```

### File Upload Errors
- **Size Exceeded**: Clear error message with size limit
- **Invalid Format**: Explanation of accepted formats
- **Network Failure**: Retry mechanism with progress
- **Quota Exceeded**: Alternative submission methods

## Performance Optimizations

### Code Splitting
```typescript
// Lazy load heavy sections
const AvailabilitySection = React.lazy(() => import('./_sections/availability'));
const ResumeSection = React.lazy(() => import('./_sections/resume'));
```

### Form Optimization
- **Debounced Validation**: Reduce API calls for email checking
- **Memoized Components**: Prevent unnecessary re-renders
- **Optimized Re-renders**: Strategic use of `useCallback` and `useMemo`
- **Virtual Scrolling**: For large team preference lists

### Data Loading
- **Prefetch Teams**: Load team data on page mount
- **Cached Validation**: Cache email uniqueness checks
- **Optimistic Updates**: UI updates before API confirmation

## Testing Considerations

### Unit Tests
- Form validation logic
- Data transformation functions
- Error handling scenarios
- File upload validation

### Integration Tests
- Complete application flow
- API integration points
- Form persistence functionality
- Error recovery scenarios

### E2E Tests
- Full application submission
- Multi-session completion
- File upload process
- Mobile/tablet experience

---

*The application form is the first impression for potential members. Keep the user experience smooth and the validation helpful but not intrusive.*
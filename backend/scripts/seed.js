const bcrypt = require('bcrypt');
const { connectDatabase, disconnectDatabase } = require('../src/config/database');
const User = require('../src/models/User');
const JobSeekerProfile = require('../src/models/JobSeekerProfile');
const EnterpriseProfile = require('../src/models/EnterpriseProfile');
const EnterpriseProfileUpdateRequest = require('../src/models/EnterpriseProfileUpdateRequest');
const Tag = require('../src/models/Tag');
const Job = require('../src/models/Job');
const SavedJob = require('../src/models/SavedJob');
const Application = require('../src/models/Application');
const Report = require('../src/models/Report');
const VerificationCode = require('../src/models/VerificationCode');
const RefreshToken = require('../src/models/RefreshToken');
const AuditLog = require('../src/models/AuditLog');

const tagSeeds = [
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'UI/UX',
  'DevOps',
  'TypeScript',
  'Python',
  'QA',
  'Data Analysis',
  'Project Management',
  'Tailwind CSS',
  'Express.js',
  'Mobile',
  'Cloud',
];

const createHash = (value) => bcrypt.hash(value, 10);

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    AuditLog.deleteMany({}),
    RefreshToken.deleteMany({}),
    VerificationCode.deleteMany({}),
    Report.deleteMany({}),
    Application.deleteMany({}),
    SavedJob.deleteMany({}),
    Job.deleteMany({}),
    Tag.deleteMany({}),
    EnterpriseProfileUpdateRequest.deleteMany({}),
    EnterpriseProfile.deleteMany({}),
    JobSeekerProfile.deleteMany({}),
    User.deleteMany({}),
  ]);

  const [adminPassword, enterprisePassword, jobSeekerPassword] = await Promise.all([
    createHash('Admin@123'),
    createHash('Enterprise@123'),
    createHash('Jobseeker@123'),
  ]);

  const admin = await User.create({
    username: 'admin',
    email: 'admin@ojss.local',
    fullName: 'System Administrator',
    passwordHash: adminPassword,
    gender: 'other',
    role: 'admin',
    isEmailVerified: true,
  });

  const enterprises = [];
  for (let index = 1; index <= 3; index += 1) {
    const enterpriseUser = await User.create({
      username: `enterprise${index}`,
      email: `enterprise${index}@ojss.local`,
      fullName: `Enterprise Manager ${index}`,
      passwordHash: enterprisePassword,
      gender: 'other',
      role: 'enterprise',
      isEmailVerified: true,
    });

    const enterpriseProfile = await EnterpriseProfile.create({
      userId: enterpriseUser._id,
      companyName: `TalentWave ${index}`,
      companyEmail: `hiring${index}@talentwave.com`,
      companyPhone: `09000000${index}`,
      companyAddress: `${index * 12} Nguyen Hue, Ho Chi Minh City`,
      taxCode: `TAX00${index}VN`,
      website: `https://talentwave${index}.example.com`,
      description: `TalentWave ${index} builds digital recruitment products and engineering teams.`,
      verificationStatus: 'verified',
      accountPlan: index === 1 ? 'premium' : 'free',
    });

    enterprises.push({ user: enterpriseUser, profile: enterpriseProfile });
  }

  const jobSeekers = [];
  for (let index = 1; index <= 10; index += 1) {
    const user = await User.create({
      username: `jobseeker${index}`,
      email: `jobseeker${index}@ojss.local`,
      fullName: `Job Seeker ${index}`,
      passwordHash: jobSeekerPassword,
      gender: index % 2 === 0 ? 'female' : 'male',
      role: 'jobseeker',
      isEmailVerified: true,
      phone: `09123456${`${index}`.padStart(2, '0')}`,
      address: `District ${((index - 1) % 5) + 1}, Ho Chi Minh City`,
    });

    const profile = await JobSeekerProfile.create({
      userId: user._id,
      dateOfBirth: new Date(1995, index % 12, index),
      experienceYears: index % 6,
      skills: [tagSeeds[index % tagSeeds.length], tagSeeds[(index + 2) % tagSeeds.length], 'Communication'],
      education: `Bachelor of Computer Science ${index}`,
      summary: `Motivated candidate ${index} looking for engineering and product opportunities.`,
      cvFileUrl: `/uploads/cvs/sample-jobseeker-${index}.pdf`,
      favouriteTags: [tagSeeds[index % tagSeeds.length], tagSeeds[(index + 1) % tagSeeds.length]],
      profileCompleted: true,
    });

    jobSeekers.push({ user, profile });
  }

  const tags = await Tag.insertMany(
    tagSeeds.map((name) => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `${name} related opportunities`,
      isActive: true,
    })),
  );

  const jobs = [];
  const statuses = ['Published', 'Published', 'Published', 'Processing', 'Rejected', 'Closed', 'Deleted'];

  for (let index = 1; index <= 20; index += 1) {
    const enterprise = enterprises[index % enterprises.length];
    const status = statuses[index % statuses.length];
    const deadlineOffset = status === 'Published' ? index + 7 : index - 8;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineOffset);

    const job = await Job.create({
      enterpriseId: enterprise.user._id,
      title: `${tagSeeds[index % tagSeeds.length]} Specialist ${index}`,
      overview: `Work on ${tagSeeds[index % tagSeeds.length]} initiatives with modern product teams.`,
      description: `This role focuses on delivery, collaboration, and measurable hiring outcomes for position ${index}.`,
      requirements: [`${tagSeeds[index % tagSeeds.length]} experience`, 'Problem solving', 'Team communication'],
      benefits: ['Hybrid work', 'Healthcare', 'Quarterly bonus'],
      location: index % 2 === 0 ? 'Ho Chi Minh City' : 'Ha Noi',
      salaryMin: 700 + index * 20,
      salaryMax: 1200 + index * 25,
      currency: 'USD',
      experienceLevel: ['Entry', 'Junior', 'Mid', 'Senior', 'Lead'][index % 5],
      jobType: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Hybrid'][index % 6],
      tags: [tags[index % tags.length]._id, tags[(index + 3) % tags.length]._id],
      applicationDeadline: deadline,
      status,
      isExpired: deadline < new Date(),
      viewCount: index * 11,
      applicantCount: 0,
      adminReview:
        status === 'Published' || status === 'Rejected'
          ? {
              reviewedBy: admin._id,
              reviewedAt: new Date(),
              note: status === 'Published' ? 'Approved for publication' : 'Please tighten the job scope',
            }
          : {},
      deletedAt: status === 'Deleted' ? new Date() : null,
    });

    jobs.push(job);
  }

  const publishedJobs = jobs.filter((job) => job.status === 'Published' && !job.isExpired);

  const savedJobs = [];
  for (let index = 0; index < 8; index += 1) {
    savedJobs.push(
      await SavedJob.create({
        jobSeekerId: jobSeekers[index % jobSeekers.length].user._id,
        jobId: publishedJobs[index % publishedJobs.length]._id,
      }),
    );
  }

  const applicationStatuses = ['Processing CV Round', 'Pass CV Round', 'Interview Scheduled', 'Offered', 'Withdrawn'];
  for (let index = 0; index < 8; index += 1) {
    const job = publishedJobs[index % publishedJobs.length];
    const candidate = jobSeekers[index % jobSeekers.length];
    const status = applicationStatuses[index % applicationStatuses.length];
    const application = await Application.create({
      jobId: job._id,
      enterpriseId: job.enterpriseId,
      jobSeekerId: candidate.user._id,
      cvFileUrl: candidate.profile.cvFileUrl,
      coverLetter: `I am interested in ${job.title}.`,
      status,
      appliedAt: new Date(Date.now() - index * 86400000),
      withdrawnAt: status === 'Withdrawn' ? new Date() : null,
      isWithdrawn: status === 'Withdrawn',
      history: [
        {
          status: 'Processing CV Round',
          changedBy: candidate.user._id,
          changedAt: new Date(Date.now() - index * 86400000),
          note: 'Application submitted',
        },
      ],
    });

    if (status !== 'Processing CV Round') {
      application.history.push({
        status,
        changedBy: job.enterpriseId,
        changedAt: new Date(),
        note: 'Reviewed by enterprise',
      });
      await application.save();
    }

    job.applicantCount += 1;
    await job.save();
  }

  for (let index = 0; index < 4; index += 1) {
    await Report.create({
      reporterId: jobSeekers[index].user._id,
      jobId: publishedJobs[(index + 1) % publishedJobs.length]._id,
      title: `Report ${index + 1}`,
      content: `This is a sample report ${index + 1} for moderation review.`,
      status: index % 2 === 0 ? 'pending' : 'reviewed',
    });
  }

  await EnterpriseProfileUpdateRequest.create({
    enterpriseId: enterprises[1].user._id,
    oldData: enterprises[1].profile.toObject(),
    newData: {
      ...enterprises[1].profile.toObject(),
      companyAddress: '88 Le Loi, Da Nang',
      description: 'Expanded delivery center and enterprise hiring operations.',
    },
    status: 'pending',
  });

  await EnterpriseProfileUpdateRequest.create({
    enterpriseId: enterprises[2].user._id,
    oldData: enterprises[2].profile.toObject(),
    newData: {
      ...enterprises[2].profile.toObject(),
      companyName: 'TalentWave 3X',
    },
    status: 'rejected',
    reviewedBy: admin._id,
    reviewedAt: new Date(),
    note: 'Branding evidence was insufficient',
  });

  console.log('Seed completed successfully.');
  console.log('Admin: admin / Admin@123');
  console.log('Enterprise: enterprise1 / Enterprise@123');
  console.log('Job seeker: jobseeker1 / Jobseeker@123');

  await disconnectDatabase();
};

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await disconnectDatabase();
  process.exit(1);
});

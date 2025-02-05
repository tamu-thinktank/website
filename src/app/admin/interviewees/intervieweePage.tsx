import * as React from 'react';
import { FilterButton } from './filterButton';
import { TableHeader } from './tableHeader';
import { ApplicantData, FilterState } from './intervieweetypes';
import { BsFillUnlockFill, BsLockFill } from 'react-icons/bs';
import { useMemberContext } from '../transfer';

export const IntervieweesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('DC');
    const { setMembers } = useMemberContext();
    const [filters, setFilters] = React.useState<FilterState>({
        team: '',
        rating: '',
        interests: '',
        major: '',
    });

    const tableHeaders = ['Name', 'Research Interests', 'Rating', 'Team Rankings', 'Major', 'Year', 'Lock'];

    const teamOptions = ['Team A', 'Team B', 'Team C', 'Reset'];
    const ratingOptions = ['1/5', '2/5', '3/5', '4/5', '5/5', 'Reset'];
    const interestOptions = ['AI', 'Robotics', 'Web Development', 'Reset'];
    const majorOptions = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Reset'];

    const [applicantData, setApplicantData] =
        React.useState<ApplicantData[]>([
            {
                name: 'John Doe',
                interests: ['AI', 'Robotics'],
                teamRankings: ['Team A', 'Team C'],
                major: 'Computer Science',
                year: 'Sophomore',
                rating: '1/5',
                category: 'DC',
                locked: false,
                id: '1'
            },
            {
                name: 'Jane Smith',
                interests: ['Web Development'],
                teamRankings: ['Team B'],
                major: 'Electrical Engineering',
                year: 'Junior',
                rating: '2/5',
                category: 'MATE ROV',
                locked: false,
                id: '2'
            },
            {
                name: 'Alex Chen',
                interests: ['Robotics'],
                teamRankings: ['Team C'],
                major: 'Mechanical Engineering',
                year: 'Senior',
                rating: '3/5',
                category: 'MATE ROV',
                locked: false,
                id: '3'
            },
        ]);

    const handleTransfer = () => {
        const lockedApplicants = filteredApplicants.filter(applicant => lockStatus[applicant.id]);
        if (lockedApplicants.length === 0) {
            alert("No interviewees are locked for transfer");
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to transfer the locked applicants?");
        if (isConfirmed) {
            setMembers(prevMembers => [...prevMembers, ...lockedApplicants]);
            const updatedApplicants = applicantData.filter(applicant =>
                !lockedApplicants.some(locked => locked.id === applicant.id)
            );
            setApplicantData(updatedApplicants);
            alert(`Transfer complete. ${lockedApplicants.length} applicant(s) transferred successfully.`);
        }
    };

    const filteredApplicants = React.useMemo(() => {
        return applicantData.filter((applicant) => {
            const matchesCategory = applicant.category === selectedCategory;
            const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMajor = !filters.major || applicant.major === filters.major;
            const matchesInterests = !filters.interests || applicant.interests.includes(filters.interests);
            const matchesTeam = !filters.team || applicant.teamRankings.includes(filters.team);
            const matchesRating = !filters.rating || applicant.rating === filters.rating;

            return matchesCategory && matchesSearch && matchesMajor && matchesInterests && matchesTeam && matchesRating;
        });
    }, [searchQuery, filters, applicantData, selectedCategory]);

    const handleFilterChange = (filterType: keyof FilterState) => (value: string) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value === prev[filterType] ? '' : value,
        }));
    };

    const [lockStatus, setLockStatus] = React.useState<{ [key: string]: boolean }>({});
    const toggleLock = (index: string) => {
        setLockStatus((prevStatus) => ({
            ...prevStatus,
            [index]: !prevStatus[index]
        }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="flex overflow-hidden flex-col text-xl font-medium bg-neutral-950 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col justify-center items-center px-16 py-5 w-full tracking-wide whitespace-nowrap bg-neutral-950 text-neutral-200 text-opacity-80 max-md:px-5 max-md:mr-2 max-md:max-w-full">
                <div className="flex flex-wrap gap-5 justify-between w-full max-w-[1538px] max-md:max-w-full">
                    <img
                        loading="lazy"
                        src="ttt.png"
                        alt="Logo"
                        className="object-contain max-w-full aspect-[2.4] w-[139px]"
                    />
                    <div className="flex gap-8 my-auto max-md:max-w-full">
                        <div className="grow">Applicants</div>
                        <div className="basis-auto">Interviewees</div>
                        <div>Members</div>
                        <div>Scheduler</div>
                        <div>Statistics</div>
                    </div>
                </div>
            </div>
            <div className='w-full border border-solid border-neutral-200'></div>

            <div className="flex overflow-hidden flex-col items-center px-20 pt-11 pb-96 mt-1 w-full  max-md:px-5 max-md:pb-24 max-md:max-w-full">
                <div className="flex flex-col mb-0 w-full max-w-[1537px] max-md:mb-2.5 max-md:max-w-full">
                    <div className="pb-10 self-start text-5xl font-semibold text-center max-md:text-4xl">
                        Interviewees
                    </div>

                    <div className="flex w-full rounded-[48px] overflow-hidden border border-solid border-neutral-200">
                        <div
                            onClick={() => setSelectedCategory('DC')}
                            className={`flex-wrap flex-1 py-2.5 pr-5 pl-20 whitespace-nowrap rounded-[37px_0px_0px_37px] max-md:pl-5 max-md:max-w-full cursor-pointer transition-colors ${selectedCategory === 'DC'
                                ? 'bg-stone-600 text-white'
                                : 'bg-neutral-950 hover:bg-stone-500 text-gray-300'
                                }`}
                        >
                            DC
                        </div>
                        <div className="w-[1.5px] bg-neutral-200"></div>
                        <div
                            onClick={() => setSelectedCategory('MATE ROV')}
                            className={`flex-wrap flex-1 py-2.5 pr-5 pl-20 whitespace-nowrap rounded-[0px_37px_37px_0px] max-md:pl-5 max-md:max-w-full cursor-pointer transition-colors ${selectedCategory === 'MATE ROV'
                                ? 'bg-stone-600 text-white'
                                : 'bg-neutral-950 hover:bg-stone-500 text-gray-300'
                                }`}
                        >
                            MATE ROV
                        </div>
                    </div>

                    <div className="shrink-0 mt-9 w-full h-px border border-solid border-neutral-200" />

                    <div className="text-sm flex gap-10 justify-start items-center self-stretch px-0 py-0 mt-8 ml-7 w-auto max-w-full tracking-wide text-neutral-200 max-md:flex-col">
                        <input
                            type="text"
                            placeholder="Search by Name or UIN"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-6 py-4 border border-solid border-neutral-200 rounded-[48px] w-[350px] max-md:px-5 max-md:w-full max-md:max-w-[500px] bg-transparent"
                        />
                        <div className="w-[1px] h-12 bg-neutral-400"></div>
                        <FilterButton
                            label="Team"
                            options={teamOptions}
                            onOptionSelect={handleFilterChange('team')}
                            selected={filters.team || "Team"}
                        />
                        <FilterButton
                            label="Rating"
                            options={ratingOptions}
                            onOptionSelect={handleFilterChange('rating')}
                            selected={filters.rating || "Rating"}
                        />
                        <FilterButton
                            label="Interests"
                            options={interestOptions}
                            onOptionSelect={handleFilterChange('interests')}
                            selected={filters.interests || "Interests"}
                        />
                        <FilterButton
                            label="Major"
                            options={majorOptions}
                            onOptionSelect={handleFilterChange('major')}
                            selected={filters.major || "Major"}
                        />
                        <button
                            className="px-6 py-3 border border-solid rounded-[48px] bg-stone-600 text-white hover:bg-stone-500 transition-colors"
                            onClick={handleTransfer}
                        >
                            Transfer
                        </button>
                    </div>

                    <div className="flex flex-col mt-7 w-full tracking-wide border border-solid border-neutral-200 rounded-[48px] max-md:pb-24 max-md:max-w-full">
                        <TableHeader headers={tableHeaders} />
                        {filteredApplicants.map((applicant, index) => (
                            <React.Fragment key={applicant.id}>
                                <div className="text-sm flex gap-10 justify-center items-center w-full py-4 px-5 hover:bg-neutral-800 transition-colors">
                                    <div className="flex-1 text-center">{applicant.name}</div>
                                    <div className="flex-1 text-center">{applicant.interests.join(', ')}</div>
                                    <div className="flex-1 text-center">{applicant.rating}</div>
                                    <div className="flex-1 text-center">{applicant.teamRankings.join(', ')}</div>
                                    <div className="flex-1 text-center">{applicant.major}</div>
                                    <div className="flex-1 text-center">{applicant.year}</div>
                                    <div className="flex-1 text-center">
                                        <button
                                            onClick={() => toggleLock(applicant.id)}
                                            className="cursor-pointer w-5 h-5"
                                        >
                                            {lockStatus[applicant.id] ? (
                                                <BsLockFill className="text-green-400" size={25} />
                                            ) : (
                                                <BsFillUnlockFill className='text-red-600' size={25} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {index < filteredApplicants.length - 1 && (
                                    <div className="shrink-0 w-full border border-solid border-neutral-200" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
# Submission Monitoring Research - Findings

## Goal
Determine if we can monitor user submissions on LeetCode to verify they completed a question within 25 minutes during a topic test.

## Test Results

### ✅ Method 1: Recent Accepted Submissions (BEST)
**Query:** `recentAcSubmissionList`

**Works:** YES

**Response includes:**
```json
{
  "id": "1799055156",
  "title": "Longest Balanced Substring II",
  "titleSlug": "longest-balanced-substring-ii",
  "timestamp": "1760248510",  // Unix timestamp
  "statusDisplay": "Accepted",
  "lang": "python3"
}
```

**Pros:**
- ✅ Returns recent 20 submissions (can specify limit)
- ✅ Includes timestamp of submission
- ✅ Shows question titleSlug (can match with our test question)
- ✅ Shows status (Accepted)
- ✅ Shows programming language used
- ✅ Public data - no authentication required

**Cons:**
- ⚠️ Only shows ACCEPTED submissions
- ⚠️ If user doesn't solve within 25min, we won't see attempt
- ⚠️ Returns max ~20 recent submissions

### ✅ Method 2: Submission Calendar
**Query:** `submissionCalendar`

**Works:** YES

**Response:**
```json
{
  "submissionCalendar": "{\"1736035200\": 4, \"1736640000\": 8, ...}"
}
```

This is a JSON string mapping Unix timestamps (day) to submission counts.

**Pros:**
- ✅ Shows ALL submissions per day
- ✅ Can track overall activity

**Cons:**
- ❌ Only shows counts per day, not individual questions
- ❌ Cannot identify which specific question was solved
- ❌ Not useful for our 25-minute verification

### ❌ Method 3: Question Status
**Query:** `question(titleSlug).status`

**Works:** NO (for public queries)

**Response:**
```json
{
  "status": null  // null when not authenticated
}
```

**Finding:**
- ❌ Requires user authentication
- ❌ Returns null for public queries
- ❌ Would need user's LeetCode session cookie

## Recommendation: Use Method 1 (Recent Submissions)

### Implementation Strategy

**For the 25-minute test monitoring:**

1. **Store test state:**
   ```typescript
   interface TestSession {
     userId: string;
     leetcodeUsername: string;
     topic: string;
     currentQuestion: number; // 1-5
     questions: Question[];
     startTime: Date;
     scores: boolean[]; // true if completed in time
   }
   ```

2. **When question starts:**
   - Record start time
   - Store question titleSlug

3. **Monitoring approach (two options):**

   **Option A: Polling** (Simpler)
   - Every 1-2 minutes, call `recentAcSubmissionList` for user
   - Check if any submission matches current question titleSlug
   - Check if submission timestamp is after question start time
   - If found within 25min → Award point, advance to next question
   - If 25min expires → No point, advance to next question

   **Option B: Timer-based** (More efficient)
   - Set a 25-minute timer using setTimeout or job queue
   - When timer expires, check recent submissions one final time
   - If question found → Award point
   - If not found → No point
   - Advance to next question

4. **Checking for submission:**
   ```typescript
   async function checkUserSubmission(
     leetcodeUsername: string,
     questionSlug: string,
     startTimestamp: number
   ): Promise<boolean> {
     const submissions = await getRecentSubmissions(leetcodeUsername, 20);

     const found = submissions.find(sub =>
       sub.titleSlug === questionSlug &&
       parseInt(sub.timestamp) >= startTimestamp &&
       sub.statusDisplay === 'Accepted'
     );

     return !!found;
   }
   ```

## Implementation Details

### Timer Mechanism

**Recommended: Hybrid approach**

```typescript
// Start question timer
function startQuestionTimer(sessionId: string, questionNumber: number) {
  const session = getSession(sessionId);
  const questionStartTime = Date.now();

  // Check periodically (every 2 minutes)
  const checkInterval = setInterval(async () => {
    const elapsed = Date.now() - questionStartTime;

    if (elapsed >= 25 * 60 * 1000) {
      // Time's up
      clearInterval(checkInterval);
      await finalizeQuestion(sessionId, questionNumber, false);
      return;
    }

    // Check if user submitted
    const submitted = await checkUserSubmission(
      session.leetcodeUsername,
      session.questions[questionNumber].titleSlug,
      Math.floor(questionStartTime / 1000)
    );

    if (submitted) {
      // User solved it!
      clearInterval(checkInterval);
      await finalizeQuestion(sessionId, questionNumber, true);
    }
  }, 2 * 60 * 1000); // Check every 2 minutes

  // Store interval ID to clean up if needed
  session.timerIntervalId = checkInterval;
}
```

### Resource Optimization

To save resources:

1. **Don't poll too frequently:**
   - Check every 2-3 minutes, not every second
   - LeetCode API has rate limits

2. **Use in-memory storage for active sessions:**
   - No database writes during test
   - Only save final score when test completes

3. **Clean up timers:**
   - Clear intervals when user completes or abandons test
   - Implement session timeout (e.g., 3 hours max)

4. **Batch cleanup:**
   - Run cleanup job every hour to remove stale sessions
   - Clear abandoned test sessions

## Limitations & Considerations

1. **Users must link LeetCode username:**
   - Need to store user's LeetCode username in database
   - Verify username exists before starting test

2. **Public vs Private submissions:**
   - Only works if user's profile is public
   - Add warning in UI

3. **Rate limiting:**
   - LeetCode may rate limit our API calls
   - Implement exponential backoff

4. **Multiple submissions:**
   - User might submit multiple times
   - We only care about first ACCEPTED submission

5. **False positives:**
   - If user solved question before test started
   - Filter by timestamp carefully

## Next Steps

1. ✅ Create test endpoint (DONE)
2. ⏳ Implement test session management
3. ⏳ Build timer mechanism with periodic checking
4. ⏳ Create frontend UI
5. ⏳ Add LeetCode username to user settings
6. ⏳ Test with real users

## Code Files

- Test endpoint: `/app/api/test/check-submission/route.ts`
- LeetCode client: `/lib/leetcode-client.ts`
- Documentation: This file

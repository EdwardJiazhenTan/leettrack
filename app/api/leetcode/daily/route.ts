import { NextResponse} from 'next/server';
import { getDailyProblem} from '@/lib/leetcode-client';
import type {DailyChallengeResponse, LeetCodeError } from '@/types/leetcode';

export async function GET(){
  try{ 
    const result = await getDailyProblem();

    if ('error' in result) {
      return NextResponse.json(
        {
          status: 'error',
          message: result.error,
          details: result.details
        },
        {status: 500}
      );
    }

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'an error occured while fetching daily questions',
        details: error instanceof Error? error.message : 'Unknown error'
      },
      {
        status : 500
      }
    );
  }
}

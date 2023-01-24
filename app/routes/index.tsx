import { defer, redirect } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

const wait = async (ms: number) => new Promise((r) => setTimeout(r, ms));

const getCriticalData = async () => {
  await wait(1000);
  return 'critical data';
};

const getNotSoCriticalData = async () => {
  await wait(1000);
  return 'not so critical data';
};

export const loader = async () => {
  const criticalData = await getCriticalData();

  if (!criticalData) {
    return redirect('/login');
  }

  const notSoCriticalDataPromise = getNotSoCriticalData();

  return defer({ criticalData, notSoCriticalDataPromise });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Critical Data</h1>
      <p>{data.criticalData}</p>
      <h1>Not So Critical Data</h1>
      <Suspense fallback={<p>loading</p>}>
        <Await
          resolve={data.notSoCriticalDataPromise}
          errorElement={<p>error</p>}
        >
          {(notSoCriticalData) => <p>{notSoCriticalData}</p>}
        </Await>
      </Suspense>
    </div>
  );
}

import type { InferGetStaticPropsType } from 'next';
import { useEffect } from 'react';
import prisma from '@lib/prisma';
import {populateTeams} from '@lib/populateTeams';

const TeamsPage = ({ teams, error }: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (error) {
    return <h1>{error}</h1>;
  }
  if (!teams) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Teams</h1>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <h2>{team.name}</h2>
            </li>
  ))}</ul></div>)
}

export const getStaticProps = async () => {
  await populateTeams();
  const teams = await prisma.teams.findMany();
  console.log(teams)

  if (!teams) {
    return {
      props: {
        error: 'Error Loading Teams',
      },
    };
  }

  return {
    props: {
      teams,
    },
    revalidate: 1200,
  };
};

export default TeamsPage;

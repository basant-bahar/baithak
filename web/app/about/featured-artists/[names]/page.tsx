import React from "react";
import Link from "next/link";
import { graphql, getFragmentData } from "__generated__";
import { ssrApolloClient } from "../../../apollo-client";
import PageHeader from "components/common/pageHeader";
import { ArtistCard } from "components/artists/artistCard";
import { ORGANIZATION_NAME } from "utils";
import { artistBasicInfo } from "graphql/concert";

interface FeaturedArtistsProps {
  params: { names: string };
}

export default async function FeaturedArtists(props: FeaturedArtistsProps) {
  const names = props.params.names;
  const artistsData = await getArtistsByNameData(names);

  if (!artistsData) return null;

  const renderTabs = () => {
    const tabData = new Array(13);
    const aChar = "A".charCodeAt(0);
    for (let i = 0; i < 26; i = i + 2) {
      tabData.push(String.fromCharCode(aChar + i) + String.fromCharCode(aChar + i + 1));
    }

    return tabData.map((text) => {
      const linkId = text.toLowerCase();
      const isActive = names === linkId;
      const linkHref = `/about/featured-artists/${linkId}`;
      return (
        <Link
          key={linkId}
          href={linkHref}
          className={`color-primary tab tab-bordered ml-2 ${
            isActive
              ? "active active: text-primary border-primary-dark"
              : "border-slate-200 text-slate-400"
          }`}
        >
          {text}
        </Link>
      );
    });
  };

  return (
    <div className="main-container">
      <PageHeader title={`Artists that have graced ${ORGANIZATION_NAME}'s stage`} />
      <div className="flex justify-center tabs text-center mb-12">{renderTabs()}</div>
      <div className="grid grid-cols-3 gap-4 max-xs:grid-cols-2">
        {artistsData.map((artistData) => {
          const artist = getFragmentData(artistBasicInfo, artistData);
          return artist && <ArtistCard key={artist.id} artist={artist} />;
        })}
      </div>
    </div>
  );
}

const getArtistsByName = graphql(`
  query getArtistsByNameStart($first: String!, $second: String!) {
    artists(
      where: { or: [{ name: { startsWith: $first } }, { name: { startsWith: $second } }] }
      orderBy: { name: ASC }
    ) {
      ...ArtistBasicInfo
    }
  }
`);

async function getArtistsByNameData(names: string) {
  let { start, end } = names
    ? { start: names[0].toUpperCase(), end: names[1].toUpperCase() }
    : { start: "A", end: "B" };

  const { data } = await ssrApolloClient.query({
    query: getArtistsByName,
    variables: { first: start, second: end },
  });

  return data.artists;
}

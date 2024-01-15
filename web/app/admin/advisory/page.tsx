"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { getFragmentData, graphql } from "__generated__";
import PageHeader from "components/common/pageHeader";
import { advisoryDetails, getAdvisories } from "../../../graphql/advisory";
import { getAdvisoryClass } from "components/advisory/util";
import Markdown from "components/concert/markdown";
import { revalidateSSRPages } from "utils/revalidateSSRPage";
import { SSR_PAGES } from "utils/ssrPages";

const newAdvisory = {
  level: "Warning",
  message: "",
};
const levels = ["Critical", "Warning", "Info"];

export default function Advisory() {
  const [advisoryId, setAdvisoryId] = useState<string | undefined>();
  const [advisoryData, setAdvisoryData] = useState(newAdvisory);
  const [dirty, setDirty] = useState(false);

  const { data, loading } = useQuery(getAdvisories);
  const [updateAdvisoryMutation] = useMutation(updateAdvisory, {
    refetchQueries: [{ query: getAdvisories }, { query: getAdvisory }],
  });
  const [createAdvisoryMutation] = useMutation(createAdvisory, {
    refetchQueries: [{ query: getAdvisories }, { query: getAdvisory }],
  });
  const [deleteAdvisoryMutation] = useMutation(deleteAdvisory, {
    refetchQueries: [{ query: getAdvisories }, { query: getAdvisory }],
  });

  useEffect(() => {
    if (data && data.advisories && data.advisories[0]) {
      const currentAdvisory = getFragmentData(advisoryDetails, data.advisories[0]);
      setAdvisoryId(currentAdvisory.id);
      setAdvisoryData({ level: currentAdvisory.level, message: currentAdvisory.message });
    }
  }, [data]);

  if (loading) return null;

  function selectLevel(e: React.ChangeEvent<HTMLSelectElement>) {
    setDirty(true);
    setAdvisoryData({ ...advisoryData, level: e.target.value });
  }

  function changeMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDirty(true);
    setAdvisoryData({ ...advisoryData, message: e.target.value });
  }

  async function handleAdvisoryDeletion(id?: string) {
    if (id === undefined) return;

    deleteAdvisoryMutation({
      variables: {
        id,
      },
    }).then(async (_) => {
      await revalidateSSRPages(SSR_PAGES.HOME);
      setAdvisoryData(newAdvisory);
      setAdvisoryId(undefined);
    });
  }

  async function saveAdvisory() {
    setDirty(false);
    if (advisoryId) {
      updateAdvisoryMutation({
        variables: {
          id: advisoryId,
          data: advisoryData,
        },
      }).then(async (_) => {
        await revalidateSSRPages(SSR_PAGES.HOME);
      });
    } else {
      createAdvisoryMutation({
        variables: {
          data: advisoryData,
        },
      }).then(async (_) => {
        await revalidateSSRPages(SSR_PAGES.HOME);
      });
    }
  }

  return (
    <>
      <div className="main-container">
        <PageHeader title="Advisory" />
        <div className="flex-auto p-6">
          <div className="form-row">
            <label className="form-label">Level</label>
            <select
              className="lg:mr-2 border-b bg-transparent focus:outline-none disabled:opacity-50"
              onChange={selectLevel}
              value={advisoryData ? advisoryData.level : levels[2]}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Message</label>
            <textarea
              className="border col-span-2 p-2"
              rows={5}
              placeholder="Advisory message"
              onChange={changeMessage}
              value={advisoryData.message}
            />
          </div>
          <div className="form-row mb-4">
            <div className="flex gap-2 col-start-2 max-xs:col-start-1">
              <button
                className="text-white bg-green-600 hover:bg-green-700"
                onClick={() => saveAdvisory()}
                disabled={!dirty}
              >
                Save
              </button>
              <button
                className="text-white bg-red-400 hover:bg-red-500"
                onClick={() => handleAdvisoryDeletion(advisoryId)}
                disabled={!advisoryId}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {advisoryData && advisoryData.message && (
        <div className={getAdvisoryClass(advisoryData.level)}>
          <Markdown>{advisoryData.message}</Markdown>
        </div>
      )}
    </>
  );
}

const getAdvisory = graphql(`
  query getAdvisory($id: Uuid!) {
    advisory(id: $id) {
      ...AdvisoryDetails
    }
  }
`);

const deleteAdvisory = graphql(`
  mutation deleteAdvisory($id: Uuid!) {
    deleteAdvisory(id: $id) {
      id
    }
  }
`);

const updateAdvisory = graphql(`
  mutation updateAdvisory($id: Uuid!, $data: AdvisoryUpdateInput!) {
    updateAdvisory(id: $id, data: $data) {
      ...AdvisoryDetails
    }
  }
`);

const createAdvisory = graphql(`
  mutation createAdvisory($data: AdvisoryCreationInput!) {
    advisory: createAdvisory(data: $data) {
      ...AdvisoryDetails
    }
  }
`);

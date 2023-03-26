"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { getFragmentData, graphql } from "__generated__";
import PageHeader from "components/common/pageHeader";
import { advisoryDetails, getAdvisories } from "../../../graphql/advisory";
import { client } from "../../apollo-client";

const newAdvisory = {
  level: "Warning",
  message: "...Advisory",
};
const levels = ["Critical", "Warning", "Info"];

export default function Advisory() {
  const [advisoryId, setAdvisoryId] = useState<number | undefined>();
  const [advisoryData, setAdvisoryData] = useState(newAdvisory);

  const { data, loading } = useQuery(getAdvisories);
  const [updateAdvisoryMutation] = useMutation(updateAdvisory);
  const [createAdvisoryMutation] = useMutation(createAdvisory);
  const [deleteAdvisoryMutation] = useMutation(deleteAdvisory);

  useEffect(() => {
    if (data && data.advisories && data.advisories[0]) {
      const currentAdvisory = getFragmentData(advisoryDetails, data.advisories[0]);
      setAdvisoryId(currentAdvisory.id);
      setAdvisoryData({ level: currentAdvisory.level, message: currentAdvisory.message });
    }
  }, [data]);

  if (loading) {
    return <>Loading...</>;
  }

  function selectLevel(e: React.ChangeEvent<HTMLSelectElement>) {
    setAdvisoryData({ ...advisoryData, level: e.target.value });
  }

  function changeMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAdvisoryData({ ...advisoryData, message: e.target.value });
  }

  async function handleAdvisoryDeletion(id?: number) {
    if (id === undefined) return;

    deleteAdvisoryMutation({
      variables: {
        id,
      },
    }).then((_) => {
      setAdvisoryData(newAdvisory);
      setAdvisoryId(undefined);

      client.cache.modify({
        fields: {
          advisories(existingAdvisories, { readField }) {
            return existingAdvisories.filter(
              (advisoryRef: any) => id !== readField("id", advisoryRef)
            );
          },
        },
      });
    });
  }

  async function saveAdvisory() {
    if (advisoryId) {
      await updateAdvisoryMutation({
        variables: {
          id: advisoryId,
          data: advisoryData,
        },
      });
    } else {
      const result = await createAdvisoryMutation({
        variables: {
          data: advisoryData,
        },
      });

      const currentAdvisory = getFragmentData(advisoryDetails, result?.data?.advisory);

      if (currentAdvisory) {
        setAdvisoryData(currentAdvisory);
        setAdvisoryId(currentAdvisory.id);
        client.cache.modify({
          fields: {
            advisories(existingAdvisories, { readField }) {
              const newAdvisoryRef = client.cache.writeFragment({
                data: currentAdvisory,
                fragment: advisoryDetails,
              });
              return [...existingAdvisories, newAdvisoryRef];
            },
          },
        });
      }
    }
  }

  return (
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
            placeholder="Bio"
            onChange={changeMessage}
            value={advisoryData.message}
          />
        </div>
        <div className="form-row mb-4">
          <div className="flex gap-2 col-start-2 max-xs:col-start-1">
            <button
              className="text-white bg-green-600 hover:bg-green-700"
              onClick={() => saveAdvisory()}
            >
              Save
            </button>
            <button
              className="text-white bg-red-400 hover:bg-red-500"
              onClick={() => handleAdvisoryDeletion(advisoryId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const getAdvisory = graphql(`
  query getAdvisory($id: Int!) {
    advisory(id: $id) {
      ...AdvisoryDetails
    }
  }
`);

const deleteAdvisory = graphql(`
  mutation deleteAdvisory($id: Int!) {
    deleteAdvisory(id: $id) {
      id
    }
  }
`);

const updateAdvisory = graphql(`
  mutation updateAdvisory($id: Int!, $data: AdvisoryUpdateInput!) {
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

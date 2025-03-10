"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InternalRefetchQueryDescriptor, useMutation, useQuery } from "@apollo/react-hooks";
import { DocumentNode } from "graphql";
import PageHeader from "./pageHeader";

type Entity<D> = { id: number } & D;

type EntityListProps<D> = {
  entityInfo: EntityInfo<D>;
  descFn: (details: D) => string | JSX.Element;
};

export class EntityInfo<D> {
  singularName: string;
  pluralName: string;
  resourcePath: string; // an overloaded cpncept tp represent the path name for UI and name of the data in the list query (TODO: Separate them)
  searchQueryDocument: DocumentNode;
  deleteMutationDocument: DocumentNode;
  deleteRefetchQueries?: InternalRefetchQueryDescriptor[];
  additionalButtons?: JSX.Element;
  showViewButton?: boolean;

  constructor(
    singularName: string,
    pluralName: string,
    resourcePath: string,
    searchQueryDocument: DocumentNode,
    deleteMutationDocument: DocumentNode,
    deleteRefetchQueries?: InternalRefetchQueryDescriptor[],
    additionalButtons?: JSX.Element,
    showViewButton?: boolean
  ) {
    this.singularName = singularName;
    this.pluralName = pluralName;
    this.resourcePath = resourcePath;
    this.searchQueryDocument = searchQueryDocument;
    this.deleteMutationDocument = deleteMutationDocument;
    this.deleteRefetchQueries = deleteRefetchQueries;
    this.additionalButtons = additionalButtons;
    this.showViewButton = showViewButton;
  }
}

export default function EntityList<D>(props: EntityListProps<D>) {
  const { entityInfo, descFn } = props;
  const {
    singularName,
    pluralName,
    resourcePath,
    searchQueryDocument,
    deleteMutationDocument,
    deleteRefetchQueries,
    additionalButtons,
    showViewButton,
  } = entityInfo;
  const [searchStr, setSearchStr] = useState("");

  const { data, loading } = useQuery<Entity<D>[]>(searchQueryDocument, {
    variables: { search: "%" + searchStr + "%" },
  });

  const entities = extractEntities(data);

  const updatedRefetchQueries = [
    ...(deleteRefetchQueries || []),
    { query: searchQueryDocument, variables: { search: "%%" } },
  ];
  const [deleteMutation] = useMutation(deleteMutationDocument, {
    onCompleted: () => {
      setSearchStr("");
    },
    refetchQueries: updatedRefetchQueries,
  });

  function extractEntities<T>(data?: any): Entity<D>[] {
    return data?.[resourcePath] ? data[resourcePath] : [];
  }

  async function deleteEntity(id: number) {
    await deleteMutation({
      variables: { id },
    });
  }

  function onSearchStrChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchStr(e.target.value);
  }

  return (
    <div className="main-container">
      <PageHeader title={pluralName} />
      {additionalButtons && additionalButtons}
      <div className="flex justify-between max-xs:flex-col-reverse p-4 mb-2 max-xs:mb-4 max-xs:p-0">
        <input
          className="simple-input max-xs:w-fit"
          type="search"
          placeholder="Search..."
          size={30}
          value={searchStr}
          onChange={onSearchStrChange}
        />
        <Link
          href={`/admin/${resourcePath}/edit/new`}
          className="bg-green-500 hover:bg-green-600 mr-2 rounded-md flex justify-center items-center disabled:opacity-50 p-2 h-8 max-xs:h-fit max-xs:w-28 max-xs:mb-4"
        >
          {`Add ${singularName}`}
        </Link>
      </div>
      {!loading && (
        <ul className="list-none mb-4 mx-auto p-4 divide-y max-xs:p-0">
          {entities.map((entity) => (
            <li key={"v-" + entity.id} className="pt-2 pb-2 flex gap-4 max-xs:gap-2">
              <div className="flex flex-grow items-center max-xs:overflow-hidden">
                {descFn(entity)}
              </div>
              <div className="flex justify-end items-center max-xs:items-start">
                <Link
                  href={`/admin/${resourcePath}/edit/${entity.id}`}
                  className="bg-blue-400 hover:bg-blue-500 w-16 h-8 mr-2 rounded-md flex justify-center items-center disabled:opacity-50"
                >
                  Edit
                </Link>
                {showViewButton && (
                  <Link
                    href={`/admin/${resourcePath}/view/${entity.id}`}
                    className="bg-orange-200 hover:bg-orange-300 w-16 h-8 mr-2 rounded-md flex justify-center items-center disabled:opacity-50"
                  >
                    View
                  </Link>
                )}
                <button
                  className="bg-red-400 hover:bg-red-500 w-16 disabled:opacity-50"
                  onClick={() => deleteEntity(entity.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

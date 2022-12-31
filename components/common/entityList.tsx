"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { DocumentNode } from "graphql";
import { client } from "../../app/apollo-client";

type Entity<D> = { id: number } & D;

type EntityListProps<D> = {
  entityInfo: EntityInfo<D>;
  descFn: (details: D) => string;
};

export class EntityInfo<D> {
  singularName: string;
  pluralName: string;
  resourcePath: string; // path name for UI and name of the data in the list query
  searchQueryDocument: DocumentNode;
  deleteMutationDocument: DocumentNode;
  preDelete?: (id: number) => void;
  additionalButtons?: JSX.Element;

  constructor(
    singularName: string,
    pluralName: string,
    resourcePath: string,
    searchQueryDocument: DocumentNode,
    deleteMutationDocument: DocumentNode,
    preDelete?: (id: number) => void,
    additionalButtons?: JSX.Element
  ) {
    this.singularName = singularName;
    this.pluralName = pluralName;
    this.resourcePath = resourcePath;
    this.searchQueryDocument = searchQueryDocument;
    this.deleteMutationDocument = deleteMutationDocument;
    this.preDelete = preDelete;
    this.additionalButtons = additionalButtons;
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
    preDelete,
    additionalButtons,
  } = entityInfo;
  const [searchStr, setSearchStr] = useState("");

  const { data, loading } = useQuery<Entity<D>[]>(searchQueryDocument, {
    variables: { search: "%" + searchStr + "%" },
  });

  const entities = extractEntities(data);

  const [deleteMutation] = useMutation(deleteMutationDocument, {
    refetchQueries: [{ query: searchQueryDocument, variables: { search: "%%" } }],
    onCompleted: () => {
      setSearchStr("");
      client.cache.evict({
        id: "ROOT_QUERY",
        fieldName: resourcePath,
        broadcast: false,
      });
    },
  });

  function extractEntities<T>(data?: any): Entity<D>[] {
    return data?.[resourcePath] ? data[resourcePath] : [];
  }

  async function deleteEntity(id: number) {
    preDelete && preDelete(id);
    await deleteMutation({ variables: { id } });
  }

  function onSearchStrChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchStr(e.target.value);
  }

  return (
    <div className="main-container">
      <h2 className="mb-8 text-center">{pluralName}</h2>
      {additionalButtons && additionalButtons}
      <div className="flex justify-between max-xs:flex-col-reverse p-4 mb-2">
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
          className="bg-green-500 hover:bg-green-600 mr-2 rounded-md flex items-center disabled:opacity-50 p-2 h-8 max-xs:w-28 max-xs:mb-4"
        >
          {`Add ${singularName}`}
        </Link>
      </div>
      {!loading && (
        <ul className="list-none mb-4 mx-auto p-4 divide-y max-xs:p-0">
          {entities.map((entity) => (
            <li key={"v-" + entity.id} className="pt-2 pb-2 flex gap-4 max-xs:gap-2">
              <div className="flex flex-grow items-center">{descFn(entity)}</div>
              <div className="flex justify-end items-center max-xs:items-start">
                <Link
                  href={`/admin/${resourcePath}/edit/${entity.id}`}
                  className="bg-blue-400 hover:bg-blue-500 w-16 h-8 mr-2 rounded-md flex justify-center items-center disabled:opacity-50"
                >
                  Edit
                </Link>
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

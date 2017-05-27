// @flow

import { NativeModules } from 'react-native';

type FieldType = 'phoneNumbers' | 'emails' | 'addresses';

type Options = {
  pageSize?: number,
  pageOffset?: number,
  fields?: FieldType[],
};

type Contact = {
  id: number,
  name: string,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  emails?: {
    email?: string,
    primary?: boolean,
    label: string,
  }[],
  phoneNumbers?: {
    number?: string,
    primary?: boolean,
    label: string,
  }[],
  addresses?: {
    street?: string,
    city?: string,
    country?: string,
    region?: string,
    neighborhood?: string,
    postcode?: string,
    pobox?: string,
    label: string,
  }[],
  company?: string,
  jobTitle?: string,
};

type Response = {
  data: Contact[],
  total: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
};

const DEFAULT_PAGE_SIZE = 100;

export async function getContactsAsync(
  { pageSize = DEFAULT_PAGE_SIZE, pageOffset = 0, fields = [] }: Options = {}
): Promise<Response> {
  return await NativeModules.ExponentContacts.getContactsAsync({
    pageSize,
    pageOffset,
    fields,
  });
}

export const PHONE_NUMBERS = 'phoneNumbers';
export const EMAILS = 'emails';
export const ADDRESSES = 'addresses';

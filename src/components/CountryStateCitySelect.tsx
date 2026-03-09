"use client";

import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Control, Controller, FieldErrors, UseFormRegister, useWatch} from "react-hook-form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {strings} from "@/constans/strings";
import {useEffect, useState} from "react";
import { FieldValues, FieldPath, FieldError } from "react-hook-form";


type WithLocationFields = {
  country?: string;
  state?: string;
  city?: string;
};

interface CountryStateCitySelectProps<T extends FieldValues & WithLocationFields> {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

type Country = {
  id: string
  name: string,
  iso2: string,
  iso3: string,
  phonecode: string,
  capital: string,
  currency: string,
  native: string,
  emoji: string
}

type State = {
  id: string,
  name: string,
  iso2: string,
}

type City = {
  id: string
  name: string,
  latitude: string,
  longitude: string,
}


export default function CountryStateCitySelect<T extends FieldValues & WithLocationFields>(
  { control, register, errors }: CountryStateCitySelectProps<T>
) {


  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const countrySelected = useWatch({
    name: "country" as FieldPath<T>,
    control,
  });

  const stateSelected = useWatch({
    name: "state" as FieldPath<T>,
    control,
  });

  useEffect(() => {
    const fetchCountries = async () => {
      const countriesResponse = await fetch('https://api.countrystatecity.in/v1/countries', {
        method: 'GET',
        headers: {
          'X-CSCAPI-KEY':  (process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY || '' ) ,
        }
      });
      setCountries(await countriesResponse.json());
    }
    fetchCountries();
  }, []);

  useEffect(() => {

    if (!countrySelected) return;

    const fetchStatesByCountry = async () => {

      setStates([]);
      setCities([]);

      const statesResponse = await fetch(`https://api.countrystatecity.in/v1/countries/${countrySelected}/states`, {
        headers: {
          'X-CSCAPI-KEY':  (process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY || '' ) ,
        }
      });
      setStates(await statesResponse.json());
    }
    fetchStatesByCountry();
  }, [countrySelected]);

  useEffect(() => {
    if (!countrySelected || !stateSelected) return;
    const fetchCitiesByState = async () => {
      const citiesResponse = await fetch(`https://api.countrystatecity.in/v1/countries/${countrySelected}/states/${stateSelected}/cities`, {
        headers: {
          'X-CSCAPI-KEY':  (process.env.NEXT_PUBLIC_COUNTRY_STATE_CITY_API_KEY || '' ) ,
        }
      });
      setCities(await citiesResponse.json());
    }
    fetchCitiesByState();
  }, [countrySelected, stateSelected]);

  return (
    <FieldGroup className="md:flex-3 md:flex-row">

      <Field className="min-w-0">
        <FieldLabel>{strings.auth.fields.country}</FieldLabel>
        <Controller
          name={"country" as FieldPath<T>}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countries.map((country) => (
                    <SelectItem key={country.iso2} value={country.iso2}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {(errors as Record<string, FieldError>)["country"] && (
          <p className="text-sm text-red-600">
            {(errors as Record<string, FieldError>)["country"].message}
          </p>
        )}
      </Field>

      <Field className="min-w-0">
        <FieldLabel>{strings.auth.fields.state}</FieldLabel>
        <Controller
          name={"state" as FieldPath<T>}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {states.map((state) => (
                    <SelectItem key={state.iso2} value={state.iso2}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {(errors as Record<string, FieldError>)["state"] && (
          <p className="text-sm text-red-600">
            {(errors as Record<string, FieldError>)["state"].message}
          </p>
        )}
      </Field>

      <Field className="min-w-0">
        <FieldLabel>{strings.auth.fields.city}</FieldLabel>
        <Controller
          name={"city" as FieldPath<T>}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {(errors as Record<string, FieldError>)["city"] && (
          <p className="text-sm text-red-600">
            {(errors as Record<string, FieldError>)["city"].message}
          </p>
        )}
      </Field>


    </FieldGroup>
  )

}
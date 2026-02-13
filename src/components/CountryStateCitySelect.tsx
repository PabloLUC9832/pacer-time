"use client";

import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Control, Controller, FieldErrors, UseFormRegister, useWatch} from "react-hook-form";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {strings} from "@/constans/strings";
import {SignUpFormData} from "@/lib/validations/auth.schema";
import {useEffect, useState} from "react";

interface CountryStateCitySelectProps {
  control: Control<SignUpFormData>;
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
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


export default function CountryStateCitySelect({ control, register, errors }: CountryStateCitySelectProps) {


  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const countrySelected = useWatch<SignUpFormData, "country">({
    name: "country",
    control: control,
  });

  const stateSelected = useWatch<SignUpFormData, "state">({
    name: "state",
    control: control,
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
          name="country"
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
        {errors.country && (
          <p className="text-sm text-red-600">
            {errors.country.message}
          </p>
        )}
      </Field>

      <Field className="min-w-0">
        <FieldLabel>{strings.auth.fields.state}</FieldLabel>
        <Controller
          name="state"
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
        {errors.state && (
          <p className="text-sm text-red-600">
            {errors.state.message}
          </p>
        )}
      </Field>

      <Field className="min-w-0">
        <FieldLabel>{strings.auth.fields.city}</FieldLabel>
        <Controller
          name="city"
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
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.city && (
          <p className="text-sm text-red-600">
            {errors.city.message}
          </p>
        )}
      </Field>


    </FieldGroup>
  )

}
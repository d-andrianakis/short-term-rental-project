import { useTranslations } from 'next-intl';

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react";

type FiltersProps = {
  loading: boolean;
  onFilter: (filter?: string) => void;
  properties:any // callback to parent
};

export default function Filters({ onFilter, loading, properties }: FiltersProps) {
  const g = useTranslations("Global");
  const t = useTranslations("Properties");

  const test = properties;
  const [data, setData] = useState([]);
  const [attributes, setAttributes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let propertyIds: string[] = [];
        // Guard against properties being null/undefined and ensure it's an array
        if (Array.isArray(properties)) {
          propertyIds = properties.map(property => property.id);
        }

        // const result = await fetch('/api/properties/getPropertyAttributes');
        const result = await fetch("/api/properties/getPropertyAttributes", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyIds),
        })
        
        const data = await result.json();

        if (Array.isArray(data) && data.length) {
          setAttributes(data);
        } else {
          setAttributes([]);
        }
      } catch (err) {
        setAttributes([]);
      } finally {
        // timeoutId = setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchData();
  }, [properties]); // re-run when properties changes

  return (
    <>
      {loading ? (
        <div>{g('loading') ?? 'Loading...'}</div>
      ) : (
        <div>
          <div>
          {
            attributes.length > 0 &&
              attributes.map((item: any) => {
                const key = item.id ?? item.text ?? Math.random().toString(36).slice(2);
                
                // Radio type attribute
                if (item?.filterType === "radio") {
                  return (
                    <div key={key} className="mb-4">
                      <RadioGroup defaultValue='radio-one'>
                        <div className="flex items-center space-x-2" key={key}>
                          <RadioGroupItem value={String(item.value)} id={key} onClick={() => onFilter(String(item.value))} />
                          <Label htmlFor={key}>{item.text}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  );
                }

                // Default to select (or other) control
                return (
                  <div key={key} className="mb-4">
                    <Label>{item.text}</Label>
                    <Select onValueChange={(v) => onFilter(v)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={item.placeholder ?? 'Select'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key={String(item.value)} value={String(item.value)}>
                          {item.text}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })
          }
          </div>
        </div>
      )}
    </>
  );
}
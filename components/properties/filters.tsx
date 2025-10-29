import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/range-slider"

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

  const [value, setValue] = useState([25, 75])

  const [data, setData] = useState([]);
  const [attributes, setAttributes] = useState<any[]>([]);

  const [propertyType, setPropertyType] = useQueryState("propertyType", { defaultValue: "" });
  const [minPrice, setMinPrice] = useQueryState("minPrice", { defaultValue: 0 });
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", { defaultValue: 0 });

  // new state to control radio selection so items that share the same value
  // will all appear selected when that value is chosen
  const [selectedRadioValue, setSelectedRadioValue] = useState<string>(String(propertyType ?? ""));

  useEffect(() => {
    // keep controlled radio state synced with query-state
    setSelectedRadioValue(String(propertyType ?? ""));
  }, [propertyType]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        let propertyIds: string[] = [];
        // Guard against properties being null/undefined and ensure it's an array
        if (Array.isArray(properties)) {
          propertyIds = properties
            .filter(p => p && typeof p.id === 'string') // ensure valid objects with string ids
            .map(p => p.id);
        }

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

  function setPropertyTypeFilter(value: string) {
    setPropertyType(value);
  }

  function setPriceRangeFilter(value: number[]) {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  }

  return (
    <>
      {loading ? (
        <div>{g('loading') ?? 'Loading...'}</div>
      ) : (
        <div>
          <div>
          {
            attributes.length > 0 && (() => {
              // separate radio-type attributes from others
              const radioAttrs = attributes.filter((a: any) => a?.filterType === "radio");
              const otherAttrs = attributes.filter((a: any) => a?.filterType !== "radio");

              return (
                <>
                  {/* Render all radio attributes inside a single RadioGroup.
                      When multiple items have the same value, they will all
                      match selectedRadioValue and appear selected together. */}
                  {radioAttrs.length > 0 && (
                    <RadioGroup value={selectedRadioValue} onValueChange={(v: string) => {
                      setSelectedRadioValue(v);
                      setPropertyTypeFilter(v);
                      onFilter(v);
                    }}>
                      {radioAttrs.map((item: any) => {
                        const key = item.propertyId ?? item.text ?? Math.random().toString(36).slice(2);

                        return (
                          <div key={key} className="mb-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={String(item.value)} id={key} />
                              <Label htmlFor={key}>{item.text}</Label>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  )}

                  {/* Render non-radio attributes as before */}
                  {otherAttrs.map((item: any) => {
                    const key = item.id ?? item.text ?? Math.random().toString(36).slice(2);

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
                  })}
                </>
              );
            })()
          }
          <div className='mt-8'>
            <Slider
              value={value}
              onValueChange={setValue}
              onValueCommit={(value: number[]) => {setPriceRangeFilter(value); onFilter();}}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Min: {value[0]}</span>
              <span>Max: {value[1]}</span>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
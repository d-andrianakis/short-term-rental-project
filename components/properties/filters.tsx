import {useTranslations} from 'next-intl';

type FiltersProps = {
  properties: Property[] | null;
  setProperties?: (p: Property[] | null) => void;
}

export default function Filters({ properties, setAvailableProperties, loading } : FiltersProps) {
    const g = useTranslations("Global");
    const t = useTranslations("Properties");

  const handleFilter = (type) => {
    if (type === "all") {
      setAvailableProperties(properties);
    } else {
      setAvailableProperties(
        properties.filter((p) => p.type === type)
      );
    }
  };

  return (
    <>
    {loading ? (
            <div>{g('loading') ?? 'Loading...'}</div>
          ) : Array.isArray(properties) && properties.length > 0 ? (
    <div>
        <div>
            <button onClick={() => handleFilter("all")}>All</button>
        </div>
        <div>
            <button onClick={() => handleFilter("house")}>Houses</button>
        </div>
        <div>
            <button onClick={() => handleFilter("apartment")}>Apartments</button>      
        </div>
    </div>
        ) : (
        <div>{t('no_properties')}</div>
    )}
    </>
  );
}

import { useState, useRef } from 'react';
import { Header } from './components';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { IoIosRemoveCircle } from 'react-icons/io';
import { AiFillPlusCircle } from 'react-icons/ai';
import { clsx } from 'clsx';

const MODE_BULK = 'BULK';
const MODE_INPUT = 'INPUT';

const App = () => {
  const [env, setEnv] = useState([]);
  const [mode, setMode] = useState(MODE_INPUT);
  const [envItem, setEnvItem] = useState({
    key: '',
    value: '',
  });
  const [bulkEnv, setBulkEnv] = useState('');
  const keyInputRef = useRef(null);

  const removeEnv = (id) => {
    if (env.length - 1 === 0) {
      setBulkEnv('');
    }
    setEnv((previousEnv) => previousEnv.filter((item) => item.id !== id));
    setBulkEnv((previousBulkEnv) => {
      const splittedFromBreakLines = previousBulkEnv.split('\n');
      return splittedFromBreakLines.filter((line) => {
        const [key] = line.split('=');
        return key !== envItem.key;
      });
    });
    toast.success('Env removed successfully');
  };

  const addEnv = () => {
    if (!envItem.key || !envItem.value) {
      return toast.error('Key and value are required');
    }
    const isKeyAlreadyExists = env.find((item) => item.key === envItem.key);
    if (isKeyAlreadyExists) {
      return toast.error('Key already exists!');
    }
    setEnv((previousEnv) => [
      ...previousEnv,
      {
        id: nanoid(),
        key: envItem.key,
        value: envItem.value,
      },
    ]);
    setEnvItem({
      key: '',
      value: '',
    });
    keyInputRef?.current?.focus();
    toast.success('Env added successfully');
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto w-full mt-16">
        <h1 className="text-4xl font-bold text-center mb-10 text-white">Env Modifier App</h1>
        <div className="border border-white p-4 rounded-md overflow-hidden">
          <div className="flex items-center gap-4">
            <button
              className={clsx('text-white w-full p-2 rounded-md text-center', {
                'bg-orange-600': mode === MODE_INPUT,
                'bg-gray-700': mode === MODE_BULK,
              })}
              onClick={() => {
                if (mode === MODE_BULK && bulkEnv.length) {
                  const splittedFromBreakLines = bulkEnv.split('\n');
                  const keyValuePairs = [];
                  splittedFromBreakLines.forEach((line) => {
                    const [key, value] = line.split('=');
                    const isKeyAlreadyExists = keyValuePairs.find((item) => item.key === key);
                    if (!key || !value) {
                      return toast.error('Key and value are required');
                    }
                    if (isKeyAlreadyExists) {
                      return toast.error('Key already exists!');
                    }
                    keyValuePairs.push({ id: nanoid(), key, value });
                  });
                  const envLength = env.length;
                  const keyValuePairsLength = keyValuePairs.length;

                  setEnv(keyValuePairs);
                  if (keyValuePairsLength - envLength > 0) {
                    toast.success(`${keyValuePairsLength - envLength} new env added successfully`);
                  }
                }
                setMode(MODE_INPUT);
              }}
            >
              Input Mode
            </button>
            <button
              className={clsx('text-white w-full p-2 rounded-md text-center', {
                'bg-orange-600': mode === MODE_BULK,
                'bg-gray-700': mode === MODE_INPUT,
              })}
              onClick={() => {
                if (env.length > 0) {
                  setBulkEnv(env.map((item) => `${item.key}=${item.value}`).join('\n'));
                }
                setMode(MODE_BULK);
              }}
            >
              Bulk Mode
            </button>
          </div>

          <div className="mt-6 pb-10">
            {mode === MODE_INPUT && (
              <div className="text-white flex flex-col gap-4">
                {env.map((envItem, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      className="w-full py-2 px-3 flex-1 bg-gray-700 text-white rounded-sm focus:outline-none border-2 border-transparent focus:border-orange-500"
                      value={envItem.key}
                      onChange={(e) => {
                        setEnv((previousEnv) => {
                          return previousEnv.map((p) => {
                            if (p.id === envItem.id) {
                              return { ...p, key: e.target.value };
                            }
                            return p;
                          });
                        });
                      }}
                    />
                    <input
                      className="w-full py-2 px-3 flex-1 bg-gray-700 text-white rounded-sm focus:outline-none border-2 border-transparent focus:border-orange-500"
                      value={envItem.value}
                      onChange={(e) => {
                        setEnv((previousEnv) => {
                          return previousEnv.map((p) => {
                            if (p.id === envItem.id) {
                              return { ...p, value: e.target.value };
                            }
                            return p;
                          });
                        });
                      }}
                    />
                    <button
                      className="w-10 rounded-sm h-10 bg-gray-700 grid place-items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                      onClick={() => removeEnv(envItem.id)}
                    >
                      <IoIosRemoveCircle fill="#fff" fontSize="20px" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-4">
                  <input
                    ref={keyInputRef}
                    className="w-full py-2 px-3 flex-1 bg-gray-700 text-white rounded-sm focus:outline-none border-2 border-transparent focus:border-orange-500"
                    placeholder="Key"
                    value={envItem.key}
                    onChange={(e) => {
                      setEnvItem((previousItem) => ({
                        ...previousItem,
                        key: e.target.value,
                      }));
                    }}
                  />
                  <input
                    className="w-full py-2 px-3 flex-1 bg-gray-700 text-white rounded-sm focus:outline-none border-2 border-transparent focus:border-orange-500"
                    placeholder="Value"
                    value={envItem.value}
                    onChange={(e) => {
                      setEnvItem((previousItem) => ({
                        ...previousItem,
                        value: e.target.value,
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addEnv();
                    }}
                  />
                  <button
                    className="w-10 rounded-sm h-10 bg-gray-700 grid place-items-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-700"
                    onClick={addEnv}
                  >
                    <AiFillPlusCircle fill="#fff" fontSize="20px" />
                  </button>
                </div>
              </div>
            )}
            {mode === MODE_BULK && (
              <textarea
                className="w-full rounded-md bg-gray-700 text-white px-2 py-2 focus:outline-none border-2 border-transparent focus:border-orange-500"
                rows={10}
                value={bulkEnv}
                onChange={(e) => {
                  setBulkEnv(e.target.value);
                }}
              ></textarea>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

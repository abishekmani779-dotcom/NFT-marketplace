import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Package, Server, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-muted bg-obsidian-900/50 border border-obsidian-800 rounded-md hover:border-gold-500/50 hover:text-slate-100 transition-colors mr-4"
      >
        <Search className="w-4 h-4" />
        <span>Search registry...</span>
        <kbd className="ml-2 px-1.5 py-0.5 bg-obsidian-800 rounded text-xs font-mono font-medium">⌘K</kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-[100] flex justify-center items-start pt-[10vh] bg-obsidian-950/80 backdrop-blur-sm"
        overlayClassName="fixed inset-0"
      >
        <div className="w-full max-w-lg bg-obsidian-900 border border-obsidian-700/50 rounded-lg shadow-2xl overflow-hidden vault-glass">
          <div className="flex items-center px-4 py-3 border-b border-obsidian-800/50">
            <Search className="w-4 h-4 text-slate-muted mr-3" />
            <Command.Input 
              placeholder="Search assets, vaults, or contracts..." 
              className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-muted"
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-obsidian-800 rounded text-xs text-slate-muted font-mono">ESC</kbd>
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="p-4 text-sm text-center text-slate-muted">
              No results found in the registry.
            </Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-1 flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-muted px-2 py-1 w-full block">Quick Links</span>
              <Command.Item 
                onSelect={() => { setOpen(false); navigate('/browse'); }}
                className="flex items-center px-2 py-2 text-sm text-slate-100 rounded-md cursor-pointer data-[selected=true]:bg-obsidian-800/80 data-[selected=true]:text-gold-400 group my-0.5"
              >
                <Package className="mr-2 w-4 h-4 text-slate-muted group-data-[selected=true]:text-gold-400" />
                Browse Market
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); navigate('/submit'); }}
                className="flex items-center px-2 py-2 text-sm text-slate-100 rounded-md cursor-pointer data-[selected=true]:bg-obsidian-800/80 data-[selected=true]:text-gold-400 group my-0.5"
              >
                <Wallet className="mr-2 w-4 h-4 text-slate-muted group-data-[selected=true]:text-gold-400" />
                Mint / Sell Asset
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); navigate('/admin'); }}
                className="flex items-center px-2 py-2 text-sm text-slate-100 rounded-md cursor-pointer data-[selected=true]:bg-obsidian-800/80 data-[selected=true]:text-gold-400 group my-0.5"
              >
                <Server className="mr-2 w-4 h-4 text-slate-muted group-data-[selected=true]:text-gold-400" />
                Oracle Dashboard
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-obsidian-800/50 my-2" />

            <Command.Group heading="Recent Assets">
                <span className="text-xs font-semibold text-slate-muted px-2 py-1 w-full block">Recent Queries</span>
              <Command.Item 
                onSelect={() => { setOpen(false); navigate('/asset/asset-001'); }}
                className="flex flex-col px-3 py-2 text-sm text-slate-100 rounded-md cursor-pointer data-[selected=true]:bg-obsidian-800/80 group my-0.5"
              >
                <span className="font-medium group-data-[selected=true]:text-gold-400">Ming Dynasty Blue & White Vase</span>
                <span className="text-xs text-slate-muted">Loc: Geneva Free-port</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}

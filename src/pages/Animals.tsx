
import React, { useState, useMemo } from 'react';
import { useMap } from '@/contexts/MapContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Cat, Dog, Filter, Search, ArrowUpDown, ExternalLink, Heart, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-media-query';

type SortField = 'name' | 'type' | 'status' | 'reportedAt' | 'reportedBy';
type SortOrder = 'asc' | 'desc';

const Animals = () => {
  const { animals } = useMap();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('reportedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Apply filters and sorting
  const filteredAndSortedAnimals = useMemo(() => {
    return [...animals]
      .filter(animal => {
        // Search filter
        const matchesSearch = 
          animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (animal.description && animal.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (animal.reportedBy && animal.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Type filter
        const matchesType = typeFilter === 'all' || animal.type === typeFilter;
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortField === 'reportedAt') {
          return sortOrder === 'asc' 
            ? new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
            : new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        } else if (sortField === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortField === 'type') {
          return sortOrder === 'asc'
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        } else if (sortField === 'status') {
          return sortOrder === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        } else if (sortField === 'reportedBy') {
          const aReportedBy = a.reportedBy || '';
          const bReportedBy = b.reportedBy || '';
          return sortOrder === 'asc'
            ? aReportedBy.localeCompare(bReportedBy)
            : bReportedBy.localeCompare(aReportedBy);
        }
        return 0;
      });
  }, [animals, searchTerm, typeFilter, statusFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return <ArrowUpDown className={`h-4 w-4 ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} />;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Animals Database</h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search animals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cat">Cats</SelectItem>
              <SelectItem value="dog">Dogs</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="needs_help">Needs Help</SelectItem>
              <SelectItem value="being_helped">Being Helped</SelectItem>
              <SelectItem value="adopted">Adopted</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => {
            setSearchTerm('');
            setTypeFilter('all');
            setStatusFilter('all');
          }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-hidden">
          <ScrollArea className={isMobile ? "h-[calc(100vh-16rem)]" : ""}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                  <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('name')}>
                    <div className="flex items-center">
                      Name {getSortIndicator('name')}
                    </div>
                  </th>
                  {!isMobile && (
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('type')}>
                      <div className="flex items-center">
                        Type {getSortIndicator('type')}
                      </div>
                    </th>
                  )}
                  <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('status')}>
                    <div className="flex items-center">
                      Status {getSortIndicator('status')}
                    </div>
                  </th>
                  {!isMobile && (
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('reportedAt')}>
                      <div className="flex items-center">
                        Reported {getSortIndicator('reportedAt')}
                      </div>
                    </th>
                  )}
                  {!isMobile && (
                    <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('reportedBy')}>
                      <div className="flex items-center">
                        Reporter {getSortIndicator('reportedBy')}
                      </div>
                    </th>
                  )}
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedAnimals.length > 0 ? (
                  filteredAndSortedAnimals.map((animal) => (
                    <tr key={animal.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          {animal.type === 'cat' ? (
                            <Cat className="w-5 h-5 mt-0.5 text-petmap-green" />
                          ) : animal.type === 'dog' ? (
                            <Dog className="w-5 h-5 mt-0.5 text-petmap-orange" />
                          ) : (
                            <MapPin className="w-5 h-5 mt-0.5 text-petmap-blue" />
                          )}
                          <div>
                            <div className="font-medium">{animal.name}</div>
                            {isMobile && (
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(animal.reportedAt), 'MMM d, yyyy')}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      {!isMobile && (
                        <td className="px-4 py-3 capitalize">{animal.type}</td>
                      )}
                      <td className="px-4 py-3">
                        <Badge 
                          variant={
                            animal.status === 'needs_help' ? 'destructive' :
                            animal.status === 'being_helped' ? 'warning' :
                            animal.status === 'adopted' ? 'success' : 'info'
                          }
                          className="text-xs"
                        >
                          {animal.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      {!isMobile && (
                        <td className="px-4 py-3 text-sm">
                          {format(new Date(animal.reportedAt), 'MMM d, yyyy')}
                        </td>
                      )}
                      {!isMobile && (
                        <td className="px-4 py-3 text-sm">
                          {animal.reportedBy || 'Anonymous'}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="Track Animal">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Link to="/">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="View on Map">
                              <MapPin className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isMobile ? 3 : 6} className="px-4 py-8 text-center text-muted-foreground">
                      {animals.length === 0 ? (
                        <div className="flex flex-col items-center gap-2">
                          <Filter className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                          <p>No animals have been reported yet</p>
                          <Link to="/">
                            <Button variant="outline" size="sm" className="mt-2">Go to Map to Report</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                          <p>No animals match your search criteria</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => {
                              setSearchTerm('');
                              setTypeFilter('all');
                              setStatusFilter('all');
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>
        
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-sm text-muted-foreground">
          Showing {filteredAndSortedAnimals.length} of {animals.length} animals
        </div>
      </div>
    </div>
  );
};

export default Animals;


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bug, Play, Download, Trash2, CheckCircle, 
  XCircle, Clock, AlertTriangle 
} from 'lucide-react';
import { debugLogger } from '@/utils/debugLogger';
import { 
  campaignTestScenarios, 
  runTestScenario, 
  runAllTestScenarios 
} from '@/utils/campaignTestScenarios';
import { useCampaignValidation } from '@/hooks/useCampaignValidation';
import { validateCampaignByType } from '@/lib/campaign-validation';

interface CampaignDevToolsProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export default function CampaignDevTools({ isVisible = false, onToggle }: CampaignDevToolsProps) {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [logs, setLogs] = useState(debugLogger.getLogs());

  // Only show in development mode
  if (!import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG !== 'true') {
    return null;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(debugLogger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const runSingleTest = async (scenarioId: string) => {
    const validateFunction = async (data: any) => {
      try {
        const result = validateCampaignByType(data);
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, errors: error.errors || error.message };
      }
    };

    const result = await runTestScenario(scenarioId, validateFunction);
    debugLogger.info('TEST_SCENARIO', `Test ${scenarioId}: ${result.passed ? 'PASSED' : 'FAILED'}`, result);
    
    setTestResults(prev => {
      const updated = prev.filter(r => r.scenarioId !== scenarioId);
      return [...updated, { scenarioId, ...result }];
    });
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    debugLogger.info('TEST_RUNNER', 'Starting all test scenarios');

    const validateFunction = async (data: any) => {
      try {
        const result = validateCampaignByType(data);
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, errors: error.errors || error.message };
      }
    };

    const results = await runAllTestScenarios(validateFunction);
    setTestResults(results.results);
    
    debugLogger.info('TEST_RUNNER', `Tests completed: ${results.passed} passed, ${results.failed} failed`, results);
    setIsRunningTests(false);
  };

  const clearLogs = () => {
    debugLogger.clearLogs();
    setLogs([]);
  };

  const exportLogs = () => {
    const logsJson = debugLogger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-debug-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600"
        size="icon"
      >
        <Bug className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Campaign Development Tools
            </CardTitle>
            <Button variant="outline" onClick={onToggle}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <Tabs defaultValue="tests" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
              <TabsTrigger value="tests">Test Scenarios</TabsTrigger>
              <TabsTrigger value="logs">Debug Logs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="flex-1 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Validation Test Scenarios</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={runAllTests} 
                      disabled={isRunningTests}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isRunningTests ? 'Running...' : 'Run All Tests'}
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {campaignTestScenarios.map((scenario) => {
                      const result = testResults.find(r => r.scenarioId === scenario.id);
                      
                      return (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{scenario.name}</h4>
                              <Badge variant={scenario.expectedValidation === 'valid' ? 'default' : 'secondary'}>
                                {scenario.expectedValidation}
                              </Badge>
                              {result && (
                                <Badge variant={result.passed ? 'default' : 'destructive'}>
                                  {result.passed ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {result.passed ? 'PASSED' : 'FAILED'}
                                </Badge>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => runSingleTest(scenario.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Run
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {scenario.description}
                          </p>
                          {result && (
                            <p className="text-xs bg-muted p-2 rounded">
                              {result.details}
                            </p>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Debug Logs</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportLogs}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" onClick={clearLogs}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-1 font-mono text-xs">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded border-l-4 ${
                          log.level === 'error' ? 'border-red-500 bg-red-50' :
                          log.level === 'warn' ? 'border-yellow-500 bg-yellow-50' :
                          log.level === 'info' ? 'border-blue-500 bg-blue-50' :
                          'border-gray-500 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-500">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {log.level}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {log.category}
                          </Badge>
                        </div>
                        <div className="text-gray-800">{log.message}</div>
                        {log.data && (
                          <div className="text-gray-600 bg-white/50 p-1 rounded mt-1 text-xs">
                            {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="flex-1 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance Monitoring</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Timing Logs
                    </h4>
                    <div className="space-y-1 text-sm">
                      {logs
                        .filter(log => log.message.includes('ms'))
                        .slice(-5)
                        .map((log, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{log.category}</span>
                            <span className="font-mono">{log.message}</span>
                          </div>
                        ))}
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Error Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Errors:</span>
                        <span className="font-mono">
                          {logs.filter(log => log.level === 'error').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Warnings:</span>
                        <span className="font-mono">
                          {logs.filter(log => log.level === 'warn').length}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseService } from '@/lib/database';
import DemoDataMigration from '@/lib/demoMigration';

export default function DatabaseTest() {
  const [connectionResult, setConnectionResult] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string>('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [demoMigrationResult, setDemoMigrationResult] = useState<string>('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionResult('');
    
    try {
      const firmId = await DatabaseService.getFirstFirmId();
      if (firmId) {
        setConnectionResult(`✅ Database connection successful! Firm ID: ${firmId}`);
      } else {
        setConnectionResult('⚠️ Connected but no firms found');
      }
    } catch (error) {
      setConnectionResult(`❌ Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const runMigration = async () => {
    setIsMigrating(true);
    setMigrationResult('');
    
    try {
      // Test basic database operations
      const firmId = await DatabaseService.getFirstFirmId();
      if (!firmId) {
        setMigrationResult('❌ No firm ID available for testing');
        return;
      }

      const projects = await DatabaseService.getProjects(firmId);
      const equipment = await DatabaseService.getEquipment('all');
      
      setMigrationResult(`✅ Database operations test successful!\n- Projects: ${projects?.length || 0}\n- Equipment: ${equipment?.length || 0}`);
    } catch (error) {
      setMigrationResult(`❌ Migration failed: ${error instanceof Error ? error.message : JSON.stringify(error, null, 2)}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const runDemoMigration = async () => {
    setIsDemoLoading(true);
    setDemoMigrationResult('');
    
    try {
      const result = await DemoDataMigration.populateCompleteDemoProject();
      setDemoMigrationResult(`🎉 Demo Migration completed successfully! 📊\n- Firms: 1\n- Projects: 1\n- Equipment: ${result.equipment.length}\n- VDCR Records: ${result.vdcrRecords.length}\n- Progress Entries: ${result.progressEntries.length}\n- Team Positions: ${result.teamPositions.length}\n🏢 Firm: ${result.firm.name}\n📋 Project: ${result.project.name}`);
    } catch (error) {
      setDemoMigrationResult(`❌ Demo Migration failed: ${error instanceof Error ? error.message : JSON.stringify(error, null, 2)}`);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Testing & Migration</h1>
        <p className="text-gray-600">Test database connection and run data migrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔌 Database Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testConnection} 
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Testing...' : 'Test Connection'}
            </Button>
            {connectionResult && (
              <div className={`p-3 rounded-lg text-sm ${
                connectionResult.includes('✅') ? 'bg-green-100 text-green-800' : 
                connectionResult.includes('⚠️') ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                <pre className="whitespace-pre-wrap">{connectionResult}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Basic Migration Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Basic Operations Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runMigration} 
              disabled={isMigrating}
              className="w-full"
            >
              {isMigrating ? 'Testing...' : 'Test Operations'}
            </Button>
            {migrationResult && (
              <div className={`p-3 rounded-lg text-sm ${
                migrationResult.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <pre className="whitespace-pre-wrap">{migrationResult}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Demo Migration */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Complete Demo Project Migration
          </CardTitle>
          <p className="text-sm text-gray-600 font-normal">
            Creates ONE complete working project with equipment, VDCR records, progress entries, and team positions for client presentation
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runDemoMigration} 
            disabled={isDemoLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            {isDemoLoading ? 'Creating Demo Project...' : '🚀 Create Complete Demo Project'}
          </Button>
          {demoMigrationResult && (
            <div className={`p-4 rounded-lg text-sm ${
              demoMigrationResult.includes('🎉') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <pre className="whitespace-pre-wrap">{demoMigrationResult}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">What This Demo Migration Creates:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>1 Complete Project:</strong> Hazira Plant Project (Reliance Industries)</li>
          <li>• <strong>4 Equipment Items:</strong> Pressure Vessel, Heat Exchanger, Storage Tank, Reactor Vessel</li>
          <li>• <strong>3 VDCR Records:</strong> Design reviews, specifications, approvals</li>
          <li>• <strong>20 Progress Entries:</strong> Material cutting, welding, inspection, assembly, testing</li>
          <li>• <strong>20 Team Positions:</strong> Welders, QC inspectors, fabricators, engineers, supervisors</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">
          This creates a fully functional demo that showcases all features: equipment management, VDCR handling, progress tracking, and team management.
        </p>
      </div>
    </div>
  );
}
